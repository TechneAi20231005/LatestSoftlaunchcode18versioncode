<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Kreait\Firebase\Contract\Storage;
use DB;
use Kreait\Firebase;
use Kreait\Firebase\Factory;
use App\Library\BarcodeData;
use Exception;
use File;

class SyncData extends Command
{
    private $db;
    protected $signature = 'sync:data';

    protected $description = 'Sync Data From Connectus Server to Database';

    public function __construct()
    {
        parent::__construct();
        $this->db = \App\Services\FirebaseService::firestore();
    }

    public function handle()
    {
        try {
            $check = DB::table('sync_data')
                //  ->where(\DB::raw("DATE_FORMAT(next_request_at,'%Y-%m-%d %H:%i')"),now()->format('Y-m-d H:i')) 
                ->where('sync_status', 'U')
                ->first();
            if ($check) {
                $response = BarcodeData::getBarcodeDataByUniqueId($check->unique_id);
                if ($response['status'] == 1) {

                    //FILE READING CONCEPT
                    $fileName = now() . '_datafile.json';
                    $path = public_path('/sync/' . $fileName);
                    File::put($path, json_encode($response), 777);
                    // $content = json_decode(File::get($path));


                    $dataToInsert = array();

                    //1. DELETE PREVIOUS BARCODE DATA FROM DATABASE & FIREBASE
                    $needToDeleteBarcodes = [];
                    foreach ($response['data'] as $d) {

                        $needToDeleteBarcodes[] = $d['barcode'];
                    }
                    foreach ($needToDeleteBarcodes as $b) {
                        $check = DB::table('product_details')->where('barcode_no', $b)->first();
                        if ($check) {
                            $this->db->collection('product_details')->document($check->id)->delete();
                            DB::table('product_details')->where('barcode_no', $b)->delete();
                        }
                    }
                    $insertedId = array();
                    //2. LOOP THROUGH EACH BARCODE DATA	
                    foreach ($response['data'] as $d) {

                        $timestamp = now()->getTimestampMs();
                        $temp['unix_timestamp'] = $timestamp;
                        $temp['client_id'] = 1;
                        $temp['barcode_no'] = $d['barcode'];
                        $temp['item_id'] = $d['item_name'] ? General::checkItem(1, $d['item_name']) : NULL;
                        $temp['category_id'] = $d['category_name'] ? General::checkItemCategory(1, $d['category_name']) : NULL;
                        $temp['collection_id'] = $d['product_collection'] ? General::checkCollection(1, $d['product_collection']) : NULL;

                        $temp['purity'] = $d['purity'];
                        $temp['gross_wt'] = $d['gross_wt'];
                        $temp['net_wt'] = $d['net_wt'];

                        $temp['labour_type'] = $d['labour_type'];
                        $temp['labour_rate_per_unit'] = $d['labour_rate_per_unit'];
                        $temp['calculate_labour_on'] = $d['calculate_labour_on'];

                        $temp['pieces'] = $d['pcs'];
                        $temp['is_studed'] = $d['is_studded'];
                        $temp['uom'] = $d['uom'];

                        $temp['current_rate'] = $d['rate'];
                        $temp['total_product_amount'] = $d['item_amount'];
                        // $temp['stone_amount'] = $d['purity'];
                        $temp['labour_amount'] = $d['labour_amount'];

                        $temp['current_status'] = $d['status_in_stock'];
                        $temp['current_store_id'] = $d['branch_name'] ? General::checkStore(1, $d['branch_name']) : NULL;
                        $temp['location_id'] = $d['location_name'] ? General::checkLocation(1, $temp['current_store_id'], $d['location_name']) : NULL;
                        $temp['hash_code'] = $d['check_sum'];
                        $insertedId[] = DB::table('product_details')->insertGetId($temp);
                    }
                    //3. GET INSERTED ID ARRAY AND UPLOAD DATA TO FIREBASE
                    app('App\Http\Controllers\Firebase\ProductController')->uploadProduct($request, $insertedId);

                    DB::table('sync_data')->update([
                        'file_url' => $path,
                        'updated_at' => now(),
                        'sync_status' => "C"
                    ]);
                } else {
                    \SystemLog::addToLog("SYNC_PROCESS", $response['message']);
                }
            } else {
                \SystemLog::addToLog("SYNC_PROCESS", "Procedure not found for sync !!!");
            }
        } catch (Exception $e) {
            \SystemLog::addToLog("SYNC_PROCESS", $e->getMessage());
        }
    }
}
