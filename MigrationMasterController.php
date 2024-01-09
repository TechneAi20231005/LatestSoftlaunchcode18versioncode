<?php

namespace App\Http\Controllers\Migration;

use App\Http\Controllers\Controller;;

use Illuminate\Http\Request;
use DB;
use Kreait\Firebase;
use Kreait\Firebase\Factory;
use App\Library\General;
use App\Library\ApplicationSettings;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Log;
use File;
use App\Library\BarcodeData;

class MigrationMasterController extends Controller
{
    public function getItemCategoryMaster(Request $request)
    {
        $dataOld = DB::connection("oldB2b")->table('cat_item_category_master')->get()->toArray();
        $dataNew = DB::table('item_category_master')->get()->toArray();
        foreach ($dataOld as $do) {
            $search_value = $do->category_nm;
            $search_key   = 'item_category_name';
            // $user = array_search($search_value, array_column($dataNew, $search_key));
            $url_in_array = in_array($search_value, array_column($dataNew, $search_key));
            if (!$url_in_array) {
                $insert = (array)$do;
                $insert['item_category_name'] = $insert['category_nm'];
                $insert['unix_timestamp'] = strtotime(date('Y-m-d H:i:s'));
                unset($insert['id']);
                unset($insert['item_id']);
                unset($insert['category_nm']);
                DB::table('item_category_master')->insert($insert);
                echo $do->category_nm . " <br>";
            }
        }
    }
    public function getItemMaster(Request $request)
    {
        $dataOld = DB::connection("oldB2b")->table('cat_item_master')->get()->toArray();
        $dataNew = DB::table('item_master')->get()->toArray();
        foreach ($dataOld as $do) {
            $search_value = $do->item_nm;
            $search_key   = 'item_name';
            // $user = array_search($search_value, array_column($dataNew, $search_key));
            $url_in_array = in_array($search_value, array_column($dataNew, $search_key));
            if (!$url_in_array) {
                $insert = (array)$do;
                $insert['item_name'] = $insert['item_nm'];
                $insert['unix_timestamp'] = strtotime(date('Y-m-d H:i:s'));
                unset($insert['id']);
                unset($insert['item_id']);
                unset($insert['item_nm']);
                // dd($insert);
                DB::table('item_master')->insert($insert);
                echo $do->item_nm . " <br>";
            }
        }
    }

    public function getProductDetails($k = 0, $l = 0)
    {
        // $check = Storage::disk('s3')->allFiles('b2b');
        // dd($check);
        // exit();

        //Copy Logic 1
        // $data = DB::table('product_details')->whereNotNull('zoom_image_url')->get();
        // foreach ($data as $d) {
        //     $images = explode("https://cspl-b2b.s3.ap-south-1.amazonaws.com/in_stock/", $d->zoom_image_url);
        //     $check = Storage::disk('s3')->exists('b2b/' . $images[1]);
        //     if ($check) {
        //         Storage::disk('s3')->copy('b2b/' . $images[1], 'in_stock/' . $images[1]);
        //     }
        // }

        //Copy Logic 2
        // $check = Storage::disk('s3')->exists('b2b/TFB22858478.JPG');
        // if ($check) {
        //     echo "exist";
        //     $image = Storage::disk('s3')->get('b2b/TFB22858478.JPG');
        //     $copied = Storage::disk('s3')->put('in_stock/TFB22858478.JPG', $image);
        //     if ($copied) {
        //         echo " Yes";
        //     } else {
        //         echo " No";
        //     }
        // } else {
        //     echo "No";
        // }

        // exit();

        $dataOld = DB::connection("oldB2b")->table('cat_product_detail')->select('cat_product_detail.*', 'cat_item_category_master.category_nm as category_name', 'cat_item_master.item_nm as item_name')
            ->leftJoin('cat_item_category_master', 'cat_product_detail.category_id', '=', 'cat_item_category_master.id')
            ->leftJoin('cat_item_master', 'cat_product_detail.item_id', '=', 'cat_item_master.id')
            ->where('current_status', "N")
            // ->where('current_status', "I")
            ->skip($k)->take($l)->get()->toArray();
        $dataNew = DB::table('product_details')->get()->toArray();
        $i = 0;
        // echo "<pre>";
        foreach ($dataOld as $do) {
            $search_value = $do->barcode_no;
            $search_key   = 'barcode_no';
            // $user = array_search($search_value, array_column($dataNew, $search_key));
            $url_in_array = in_array($search_value, array_column($dataNew, $search_key));
            if (!$url_in_array) {

                $item_id = General::checkStore(1, $do->item_name);
                $store_id = General::checkStore(1, $do->location);
                $counter_id = General::checkLocation(1, $store_id, $do->current_location);
                $category_id = General::checkItemCategory(1, $do->category_name);

                $insert = (array)$do;
                $insert['client_id'] = 1;
                $insert['item_id'] = $item_id;
                $insert['collection_id'] = null;
                $insert['labour_type'] = "";
                $insert['labour_rate_per_unit'] = null;
                $insert['calculate_labour_on'] = "";
                $insert['labour_amount'] = null;
                $insert['category_id'] = $category_id;
                $insert['unix_timestamp'] = strtotime(date('Y-m-d H:i:s'));
                $insert['wastage_amount'] = $insert['wastage_amt'];
                $insert['stone_amount'] = $insert['stone_amt'];
                $insert['discount_percentage'] = ($insert['discount']) ? $insert['discount'] : 0.00;
                $insert['total_product_amount'] = $insert['product_price'];
                $insert['uploaded_source'] = $insert['upload_source'];
                $insert['location_id'] = $counter_id;
                $insert['current_store_id'] = $store_id;
                $insert['current_status'] = "I";
                $insert['hash_code'] = Hash::make($insert['barcode_no'] . $insert['labour_type'] . $insert['location_id'] . $insert['current_store_id'] . "0" . $insert['collection_id'] . "I");

                $images = DB::connection("oldB2b")->table('cat_product_images')->where('product_id', $insert['id'])->get();
                $insert['zoom_image_url'] = (count($images) > 0) ? str_replace("https://cspl-b2b.s3.ap-south-1.amazonaws.com/b2b/", "", $images[0]->app_image_source) : NULL;
                $insert['front_image_url'] = (count($images) > 1) ? str_replace("https://cspl-b2b.s3.ap-south-1.amazonaws.com/b2b/", "", $images[1]->app_image_source) : NULL;
                $insert['left_image_url'] = (count($images) > 2) ? str_replace("https://cspl-b2b.s3.ap-south-1.amazonaws.com/b2b/", "", $images[2]->app_image_source) : NULL;
                $insert['right_image_url'] = (count($images) > 3) ? str_replace("https://cspl-b2b.s3.ap-south-1.amazonaws.com/b2b/", "", $images[3]->app_image_source) : NULL;
                $insert['top_image_url'] = (count($images) > 4) ? str_replace("https://cspl-b2b.s3.ap-south-1.amazonaws.com/b2b/", "", $images[4]->app_image_source) : NULL;

                DB::table('product_images')->insert(['barcode_no' => $insert['barcode_no'], 'zoom_image_url' => $insert['zoom_image_url'], 'front_image_url' => $insert['front_image_url'], 'left_image_url' => $insert['left_image_url'], 'right_image_url' => $insert['right_image_url'], 'top_image_url' => $insert['top_image_url']]);

                $check = Storage::disk('s3')->exists('b2b/' . $insert['zoom_image_url']);
                if ($check) {
                    $image = Storage::disk('s3')->get('b2b/' . $insert['zoom_image_url']);
                    Storage::disk('s3')->put('in_stock/' . $insert['zoom_image_url'], $image);
                }


                // $images = DB::connection("oldB2b")->table('cat_product_images')->where('product_id', $insert['id'])->get();
                // $arrayName = ['zoom_image_url', 'front_image_url', 'left_image_url', 'right_image_url', 'top_image_url'];
                // if (count($images) > 0) {
                //     for ($j = 0; $j < count($images); $j++) {
                //         $insert[$arrayName[$j]] = $images[$j]->app_image_source;
                //     }
                // }

                unset($insert['id']);
                unset($insert['location']);
                unset($insert['current_location']);
                unset($insert['wastage_amt']);
                unset($insert['wastage']);
                unset($insert['status_changed_by']);
                unset($insert['discount']);
                unset($insert['product_price']);
                unset($insert['category_name']);
                unset($insert['item_name']);
                unset($insert['is_active']);
                unset($insert['upload_source']);
                unset($insert['stone_amt']);
                unset($insert['manual_update']);
                unset($insert['diamond_wt']);

                unset($insert['zoom_image_url']);
                unset($insert['front_image_url']);
                unset($insert['left_image_url']);
                unset($insert['right_image_url']);
                unset($insert['top_image_url']);

                // print_r($insert);
                DB::table('product_details')->insertGetId($insert);

                $i++;
                // echo $i . " ";
                // echo $do->barcode_no . " <br>";
            }
        }
    }

    function getProductDetailsSyncAll($k = 0)
    {
        $n = 10000;
        $l = 2000;
        if ($k < $n) {
            $this->getProductDetails($k, $l);
            sleep(10);
            $j = $k + 2000;
            $this->getProductDetailsSyncAll($j);
        }
    }

    public function getProductDetailsUpload(\Illuminate\Http\Request $request)
    {
        $barcodes = array();
        $dataOld = DB::connection("oldB2b")->table('cat_product_detail')->select('cat_product_detail.*', 'cat_item_category_master.category_nm as category_name', 'cat_item_master.item_nm as item_name')
            ->leftJoin('cat_item_category_master', 'cat_product_detail.category_id', '=', 'cat_item_category_master.id')
            ->leftJoin('cat_item_master', 'cat_product_detail.item_id', '=', 'cat_item_master.id')
            ->where('current_status', "N")
            // ->where('current_status', "I")
            ->skip(100)
            ->take(10)->get()->toArray();
        $dataNew = DB::table('product_details')->get()->toArray();
        $i = 0;
        foreach ($dataOld as $do) {
            $search_value = $do->barcode_no;
            $search_key   = 'barcode_no';
            $url_in_array = in_array($search_value, array_column($dataNew, $search_key));
            if (!$url_in_array) {
                $barcodes[] = $do->barcode_no;
            }
        }

        $response = BarcodeData::getBarcodeData($barcodes);
        // echo "<pre>";
        // print_r($response);
        // exit;

        if ($response['status'] == 1) {
            $dataToInsert = array();

            //1. DELETE PREVIOUS BARCODE DATA FROM DATABASE & FIREBASE
            $needToDeleteBarcodes = [];
            foreach ($response['data'] as $d) {
                $needToDeleteBarcodes[] = $d['barcode'];
            }

            // foreach ($needToDeleteBarcodes as $b) {
            //     $check = DB::table('product_details')->where('barcode_no', $b)->first();
            //     if ($check) {
            //         $this->db->collection('product_details')->document($check->id)->delete();
            //         DB::table('product_details')->where('barcode_no', $b)->delete();
            //     }
            // }

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
            // app('App\Http\Controllers\Firebase\ProductController')->uploadProduct($request, $insertedId);
        } else {
            echo $response['message'];
        }
    }

    public function CopyProduct()
    {
        $dataOld = DB::table('product_images1')->get();
        $imagename = ['zoom_image_url', 'front_image_url', 'left_image_url', 'right_image_url', 'top_image_url'];
        foreach ($dataOld as $images) {
            echo "Barcode = $images->barcode_no <br>";
            $moved = [];
            foreach ($imagename as $k) {
                // echo $k . "=" . $images->$k . " = " . strtoupper(substr($k, 0, 1)) . "<br>";
                $check = Storage::disk('s3')->exists('b2b/' . $images->$k);
                if ($check) {
                    $check1 = Storage::disk('s3')->exists('in_stock/' . $images->$k);
                    if (!$check1) {
                        $image = Storage::disk('s3')->get('b2b/' . $images->$k);
                        Storage::disk('s3')->put('in_stock/' . $images->$k, $image);
                        array_push($moved, strtoupper(substr($k, 0, 1)));
                    }
                }
            }
            // echo "<br>";
            $moved = implode(', ', $moved);
            DB::table('product_images1')->where('id', $images->id)->update(['moved_in_stock' => "Y", 'moved_images' => $moved]);
        }
    }
}
