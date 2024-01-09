<?php
namespace App\Library;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use DB;
use Illuminate\Support\Facades\Storage;

class TaskSupportiveController 
{
    static function assignedUser($type,$tenantId=NULL,$ticketId,$ticketBasketId,$taskId,$assignedUser,$date,$updatingUser){
        
        $ticketData=DB::table('tai_ticket_master')->where('id',$ticketId)->first();

        if($type=="INSERTION"){
            // dd("Ge",$assignedUser);
            if(!is_array($assignedUser)){
                $assignedUser=explode(",",$assignedUser);
            }
            // dd("Process",$assignedUser);
            foreach($assignedUser as $user){
                //Insert into Table
                $assignUserData=['tenant_id'=>$tenantId,
                                 'ticket_id'=>$ticketId,
                                 'ticket_basket_id'=>$ticketBasketId,
                                 'ticket_task_id'=>$taskId,
                                 'task_owner_id'=>$user,
                                 'created_at'=>$date,
                                 'created_by'=>$updatingUser,
                                ];
                DB::table('tai_ticket_task_owner')->insert($assignUserData);

                //Create Notification
                $userInfo=CommonController::userInfo($updatingUser,['first_name','last_name']);
                $msg="Task has been assigned by " .$userInfo->first_name." ".$userInfo->last_name." for ".$ticketData->ticket_id;
                $url="Ticket/Task/".$taskId;
                CommonController::addNotification($updatingUser,$user,$msg,$url);
            }
        }else if($type=="UPDATION"){
            //Deactivate all previous user
            //Check all data if found the activate user else insert new user
            DB::table('tai_ticket_task_owner')->where('ticket_task_id',$taskId) 
                                              ->update(['is_active'=>0,
                                                        'updated_at'=>$date,
                                                        'updated_by'=>$updatingUser
                                                      ]);
            foreach($assignedUser as $user){

                $checkUser=DB::table('tai_ticket_task_owner')
                                    ->where('ticket_id',$ticketId)
                                    ->where('ticket_basket_id',$ticketBasketId)
                                    ->where('ticket_task_id',$taskId)
                                    ->where('task_owner_id',$user)
                                    ->orderBy('id','desc')
                                    ->first();
                 if($checkUser){
                    DB::table('tai_ticket_task_owner')->where('id',$checkUser->id)
                                                        ->update(['is_active'=>1,
                                                                  'updated_at'=>$date,
                                                                  'updated_by'=>$updatingUser]);
                 }else{
                    $assignUserData=['tenant_id'=>$tenantId,
                                    'ticket_id'=>$ticketId,
                                    'ticket_basket_id'=>$ticketBasketId,
                                    'ticket_task_id'=>$taskId,
                                    'task_owner_id'=>$user,
                                    'created_at'=>$date,
                                    'created_by'=>$updatingUser,
                                    ];
                    DB::table('tai_ticket_task_owner')->insert($assignUserData);

                    //Create Notification
                    $userInfo=CommonController::userInfo($updatingUser,['first_name','last_name']);
                    $msg="Task has been assigned by " .$userInfo->first_name." ".$userInfo->last_name." for ".$ticketData->ticket_id;
                    $url="Ticket/Task/".$taskId;
                    CommonController::addNotification($updatingUser,$user,$msg,$url);
                }                   
            }
        }
        return ;
    }

    static function dependentTask($type,$tenantId=NULL,$ticketId,$ticketBasketId,$taskId,$dependentTask,$date,$updatingUser)
    {
        if($dependentTask){
            if(!is_array($dependentTask)){
                $dependentTask=explode(',',$dependentTask);
            }
            if($type=="INSERTION"){
                foreach($dependentTask as $d){
                    DB::table('tai_ticket_dependent_task')->insert([
                                                                        'tenant_id'=>$tenantId,
                                                                        'ticket_id'=>$ticketId,
                                                                        'ticket_basket_id'=>$ticketBasketId,
                                                                        'ticket_task_id'=>$taskId,
                                                                        'dependent_task_id'=>$d,
                                                                        'created_at'=>$date,
                                                                        'created_by'=>$updatingUser
                                                                    ]);
                }
            }else{
                DB::table('tai_ticket_dependent_task')->where('ticket_task_id',$taskId)->update(['is_active'=>0]);
                foreach($dependentTask as $d){
                    $check=DB::table('tai_ticket_dependent_task')->where(['tenant_id'=>$tenantId,
                                                                            'ticket_id'=>$ticketId,
                                                                            'ticket_basket_id'=>$ticketBasketId,
                                                                            'ticket_task_id'=>$taskId,
                                                                            'dependent_task_id'=>$d
                                                                        ])
                                                                        ->orderBy('id','desc')
                                                                        ->first();    
                    if($check){
                        DB::table('tai_ticket_dependent_task')->where('id',$check->id)->update(['is_active'=>1,
                                                                                                 'created_at'=>$date,
                                                                                                 'created_by'=>$updatingUser
                                                                                                ]);
                    }else{
                        DB::table('tai_ticket_dependent_task')->insert([
                                                                        'tenant_id'=>$tenantId,
                                                                        'ticket_id'=>$ticketId,
                                                                        'ticket_basket_id'=>$ticketBasketId,
                                                                        'ticket_task_id'=>$taskId,
                                                                        'dependent_task_id'=>$d,
                                                                        'created_at'=>$date,
                                                                        'created_by'=>$updatingUser
                                                                    ]);
                    }                                                     
                }
            }
        }
        return ;
    }

       
    static public function getBetweenDates($startDate, $endDate)
    {
        $rangArray = [];

        $exclude = ['Sunday','Saturday'];
        $startDate = strtotime($startDate);
        $endDate = strtotime($endDate);    
        for ($currentDate = $startDate; $currentDate <= $endDate; $currentDate += (86400)) {
                                                
            $date = date('Y-m-d', $currentDate);
            $day= date('l', strtotime($date));
            if(!in_array($day,$exclude)){
                $rangArray[] = $date;
            }
        }
        return $rangArray;
    }


    // $taskHours="07:30";
    // $breakTime=explode(":",$taskHours);
    // $totalHour=$breakTime[0];
    // $totalMin=$breakTime[1];

    // $totalCalculatedHours= $totalHour+($totalMin/60);
    
    // $totalCalculatedHours=number_format($totalCalculatedHours, 2);     
    
    // $individualHours=$totalCalculatedHours/3;     // divind for user       
    
    // echo $individualHours;
    // echo "<br>";
    
    
    // $perDayWork=$individualHours/5;   //No of days
    // echo $perDayWork;
    // echo "<br>";
    
    
    // $breakHour=explode(".",$perDayWork);
    // $breakHourTemp=number_format($breakHour[0]);
    // $breakMinTemp=number_format($breakHour[1]*60,2);
    
    
    // echo $breakHourTemp.":".$breakMinTemp;
  

    static function taskAllocation($type,$tenantId=NULL,$ticketId,$ticketBasketId,$taskId,$assignedUser,$date,$updatingUser,$fromDate,$toDate,$taskHours){
        
        $dates=TaskSupportiveController::getBetweenDates($fromDate,$toDate);
        
        $breakTime=explode(":",$taskHours);
        $totalHour=$breakTime[0];
        $totalMin=$breakTime[1];
 
        

        //step1
        $totalCalculatedHours= $totalHour+($totalMin/60);
        $totalCalculatedHours=number_format($totalCalculatedHours, 2);     
        $individualHours=$totalCalculatedHours/count($assignedUser);
        

        if($type=="INSERTION"){
        
        }else{
            DB::table('tai_task_planner')->where(['ticket_id'=>$ticketId,'ticket_task_id'=>$taskId])->update(['is_active'=>0]);
        }

        $totalMinutes=($breakTime[0]*60)+$breakTime[1];

        $totalMinutesPerUser = $totalMinutes/count($assignedUser);

            foreach($dates as $d){  

                foreach($assignedUser as $user){

                    $perDayWork=$individualHours/count($dates);     
                
                    $total_hours_in_min=$perDayWork*60;

                    // $hours =floor($perDayWork / 60) ;
                    // $minutes =$perDayWork % 60;
                    // $total_hours=sprintf("%02d:%02d", $hours, $minutes); 
                   
                    // dd($perDayWork,$total_hours);
                    // $breakHour=explode(".",$perDayWork);
                    // $breakHourTemp=sprintf("%02d", $breakHour[0]);
                    // $breakMinTemp="00";

                    // if($breakHour[1]!=0){
                    //     if($breakHour[1] >= 100)   
                    //     {
                    //         $breakHour[1]=substr($breakHour[1],0,3)/1000;
                    //     }else if($breakHour[1] >= 10 && $breakHour[1] < 100 ){
                            
                    //         $breakHour[1]=substr($breakHour[1],0,3)/100;
                    //     }else{
                    //         $breakHour[1]=  $breakHour[1]/10;
                    //     }
                    //     $breakMinTemp=$breakHour[1]*60;
                    //     $breakMinTemp=(int)round($breakMinTemp,0);
                    //     $breakMinTemp="0".$breakMinTemp;
                    // }
                

                    $dailyUserWork=round($totalMinutesPerUser/count($dates));
                
                    $conversionToHours=$dailyUserWork/60;   

                    $IntConversionToHours = (int)$conversionToHours;
                    $FloatConversionToHours = number_format((float)$conversionToHours, 2, '.', '');
                    
                    $newDiff=$FloatConversionToHours-$IntConversionToHours;  
                    $newDiff=$newDiff*0.6;   
                    $newValue=$IntConversionToHours+$newDiff;

  

                    $a=number_format((float)$newValue, 2, '.', '');
                    $a1=explode('.',$a);
                    $a1[0] = $a1[0] < 10 ? "0$a1[0]" : $a[0];  
                    $a2=implode(':',$a1);    
                

                    $insertData=[
                        'ticket_id'=>$ticketId,
                        'ticket_basket_id'=>$ticketBasketId,
                        'ticket_task_id'=>$taskId,
                        'user_id'=>$user,
                        'created_at'=>$date,
                        'created_by'=>$updatingUser,
                        'date'=>$d,
                        'total_hours'=>$a2,
                        'total_hours_in_min'=>$dailyUserWork,    
                    ];
                
                    DB::table('tai_task_planner')->insert($insertData);
                }
            }
        return ;
    } 

    static function taskAllocationOld($type,$tenantId=NULL,$ticketId,$ticketBasketId,$taskId,$assignedUser,$date,$updatingUser,$fromDate,$toDate,$taskHours){
        
        $dates=TaskSupportiveController::getBetweenDates($fromDate,$toDate);

        $taskHours=str_replace(":",".",$taskHours);

        if($type=="INSERTION"){

            $individualHours=$taskHours/count($assignedUser);

            foreach($dates as $d){

                foreach($assignedUser as $user){
                    
                    $hours=$individualHours/count($dates);
                    
                    $hours=number_format((float)$hours, 2, '.', '');

                    if((int)$hours != $hours){
                        //Decimal
                        $break=explode('.',$hours);
                        $tempMin=$break[0]*60;
                        $min=(int)$break[1];
                        $hours_in_min=($tempMin+$min);
                    }else{  
                        //Integer
                        $hours_in_min=$hours*60;
                    }
                    DB::table('tai_task_planner')->insert([
                                'ticket_id'=>$ticketId,
                                'ticket_basket_id'=>$ticketBasketId,
                                'ticket_task_id'=>$taskId,
                                'user_id'=>$user,
                                'created_at'=>$date,
                                'created_by'=>$updatingUser,
                                'date'=>$d,
                                'total_hours'=>$hours,
                                'total_hours_in_min'=>$hours_in_min,    
                        ]);
                }
            }
            
        }else{

            DB::table('tai_task_planner')->where(['ticket_id'=>$ticketId,'ticket_task_id'=>$taskId])
                                         ->update(['is_active'=>0]);

                                         $individualHours=$taskHours/count($assignedUser);

                                         foreach($dates as $d){
                             
                                             foreach($assignedUser as $user){
                                                 
                                                $hours=$individualHours/count($dates);
                                                 
                                                $hours=number_format((float)$hours, 2, '.', '');
                                                
                                                $hoursArr=explode('.',$hours);
                                                if($hours[1]==60){
                                                    $hoursArr[0]=$hoursArr[0]+1;
                                                    $hoursArr[1]="00";
                                                    $hours=$hoursArr[0].".".$hoursArr[1];
                                                }

                                                 if((int)$hours != $hours){
                                                     //Decimal
                                                     $break=explode('.',$hours);
                                                     
                                                     $tempMin=$break[0]*60;
                                                     
                                                     $min=(int)$break[1];

                                                     $hours_in_min=($tempMin+$min);
                                                 }else{  
                                                     //Integer
                                                     $hours_in_min=$hours*60;
                                                 }
                                                 DB::table('tai_task_planner')->insert([
                                                             'ticket_id'=>$ticketId,
                                                             'ticket_basket_id'=>$ticketBasketId,
                                                             'ticket_task_id'=>$taskId,
                                                             'user_id'=>$user,
                                                             'created_at'=>$date,
                                                             'created_by'=>$updatingUser,
                                                             'date'=>$d,
                                                             'total_hours'=>$hours,
                                                             'total_hours_in_min'=>$hours_in_min,    
                                                     ]);
                                             }
                                         }

            
        }
        return ;
    }   
}
?>