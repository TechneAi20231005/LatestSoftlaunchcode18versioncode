<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CountryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\DynamicFormController;
use App\Http\Controllers\TicketBasketController;
use App\Http\Controllers\TicketTaskController;
use App\Http\Controllers\TicketTaskTimerController;
use App\Http\Controllers\TicketSubtaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SubModuleController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\ModuleSettingController;
use App\Http\Controllers\ErrorLogController;
use App\Http\Controllers\CustomerMappingController;
use App\Http\Controllers\CustomerTypeController;
use App\Http\Controllers\QueryTypeController;
use App\Http\Controllers\ConnectorController; //Suyash 22-4-22
use App\Http\Controllers\TestCaseController; //Suyash 22-4-22
use App\Http\Controllers\WhatsappController; //Suyash 11-5-22
use App\Http\Controllers\CustomReportController; //Suyash 08-6-22
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\DepartmentMappingController;
use App\Http\Controllers\ConsolidatedViewController;
use App\Http\Controllers\DynamicFormDropdownMasterController;
use App\Http\Controllers\BillTypeMasterController;
use App\Http\Controllers\PaymentTemplateController;
use App\Http\Controllers\VendorMasterController;
use App\Http\Controllers\BillCheckingTransaction;
use App\Http\Controllers\BillTypeMappingController;
use App\Http\Controllers\BillCheckAuthority;
use App\Http\Controllers\BillPayment;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::get('updatePlanningTime', function () {
	$planner = DB::table('tai_task_planner')
		->where('id', 1)
		->get();
	foreach ($planner as $p) {

		// $time=explode(".",$p->total_hours);
		// $time[0]=$time[0] >= 10 ? $time[0] : "0".$time[0];
		// $time[1]=$time[1] >= 10 ? $time[1] : "0".$time[1];

		// dd($time);


		$total_hours_temp = explode('.', $p->total_hours);

		if (count($total_hours_temp) > 1) {

			$total_hours_temp[1] = substr($total_hours_temp[1], 0, 2);
			$total_hours_temp[1] = (int)round($total_hours_temp[1] * 0.6);

			if ($total_hours_temp[1] >= 60) {
				$total_hours_temp[1] = "00";
				$total_hours_temp[0] = $total_hours_temp[0] + 1;
			}
			$total_hours = ($total_hours_temp[0] >= 10 ? $total_hours_temp[0] : "0" . $total_hours_temp[0]) . ":" . ($total_hours_temp[1] >= 10 ? $total_hours_temp[1] : "0" . $total_hours_temp[1]);
			$cal = $total_hours_temp[0] . "." . $total_hours_temp[1];
			$total_hours_in_min = (float)$cal * 60;
		} else {
			$total_hours = ($total_hours_temp[0] >= 10 ? $total_hours_temp[0] : "0" . $total_hours_temp[0]) . ":00";
			$cal = $total_hours_temp[0] . ".0";
			$total_hours_in_min = $cal * 60;
		}


		$up = DB::table('tai_task_planner')
			->where('id', $p->id)
			->update([
				'total_hours' => $total_hours,
				'total_hours_in_min' => $total_hours_in_min
			]);
		dd($up);
		exit();
	}
});

Route::post('/', [EmployeeController::class, 'getData']);
Route::get('dataMerger', [EmployeeController::class, 'dataMerger']);

Route::post('/login', [EmployeeController::class, 'login']);

// ResetPasswordController
Route::group(['prefix' => 'reset'], function () {
	Route::post('forgetPasswordOtp', [ResetPasswordController::class, 'forgotPassOtp']);
	Route::post('sendOtp', [ResetPasswordController::class, 'resetPasswordOtp']);
	Route::post('resetPassword', [ResetPasswordController::class, 'resetPassword']);
});


// Route::get('/notification/{userId}', [NotificationController::class, 'getData']);
Route::group(['prefix' => 'notification'], function () {
	Route::get('/getNotification/{tenantId}/{userId}', [NotificationController::class, 'getNotification']);
	Route::get('/markedReadNotification/{id}', [NotificationController::class, 'markedReadNotification']);
	Route::get('/getAllNotification/{tenantId}/{userId}', [NotificationController::class, 'getAllNotification']);
});
//Dashboard
Route::get('dashboard/{userId}', [DashboardController::class, 'task']);
Route::get('mobileDashboard/{userId}', [DashboardController::class, 'mobileTask']);

Route::group(['prefix' => 'attachment'], function () {
	Route::get('/{id}/{type}', [AttachmentController::class, 'getData']);
	Route::delete('/{id}', [AttachmentController::class, 'deleteData']);
});


//Country
Route::group(['prefix' => 'countryMaster'], function () {
	Route::get('/getAllCountry/{tenantId}/{type?}', [CountryController::class, 'getAllCountry']);
	Route::get('/getCountryById/{id}', [CountryController::class, 'getCountryById']);
	Route::post('/createCountry', [CountryController::class, 'createCountry']);
	Route::post('/updateCountry/{id}', [CountryController::class, 'updatedCountry']);
	Route::delete('/deleteCountry{id}', [CountryController::class, 'deleteCountry']);
});

//State
Route::group(['prefix' => 'stateMaster'], function () {
	Route::get('/getAllState/{tenantId}/{type?}', [StateController::class, 'getAllState']);
	Route::get('/getStateById/{id}', [StateController::class, 'getStateById']);
	Route::post('/createState', [StateController::class, 'createState']);
	Route::post('/updateState/{id}', [StateController::class, 'updateState']);
	Route::delete('/deleteState/{id}', [StateController::class, 'deleteState']);
});

//City 
Route::group(['prefix' => 'cityMaster'], function () {
	Route::get('/getAllCity/{tenantId}/{type?}', [CityController::class, 'getAllCity']);
	Route::get('/getCityById/{id}', [CityController::class, 'getCityById']);
	Route::post('/createCity', [CityController::class, 'createCity']);
	Route::post('/updateCity/{id}', [CityController::class, 'updateCity']);
	Route::delete('/deleteCity/{id}', [CityController::class, 'deleteCity']);
});

//Designation
Route::group(['prefix' => 'designationMaster'], function () {
	Route::get('/getAllDesignation/{tenantId}', [DesignationController::class, 'getAllDesignation']);
	Route::get('/getDesignationById/{id}', [DesignationController::class, 'getDesignationById']);
	Route::post('/createDesignation', [DesignationController::class, 'createDesignation']);
	Route::post('/updateDesignation/{id}', [DesignationController::class, 'updateDesignation']);
	Route::delete('/deleteDesignation/{id}', [DesignationController::class, 'deleteDesignation']);
});

//Department
Route::group(['prefix' => 'departmentMaster'], function () {
	Route::get('/getAllDepartment/{tenantId}', [DepartmentController::class, 'getAllDepartment']);
	Route::get('/getDepartmentById/{id}', [DepartmentController::class, 'getDepartmentById']);
	Route::post('/createDepartment', [DepartmentController::class, 'createDepartment']);
	Route::post('/updateDepartment/{id}', [DepartmentController::class, 'updateDepartment']);
	Route::delete('/deleteDepartment/{id}', [DepartmentController::class, 'deleteDepartment']);
});


//Role
Route::group(['prefix' => 'roleMaster'], function () {
	Route::get('/getAllRole/{tenantId}', [RoleController::class, 'getAllRole']);
	Route::get('/getRoleById/{id}', [RoleController::class, 'getRoleById']);
	Route::post('/createRole', [RoleController::class, 'createRole']);
	Route::post('/updateRole/{id}', [RoleController::class, 'updateRole']);
	Route::delete('/deleteRole/{id}', [RoleController::class, 'deleteRole']);
});

//Employees 
Route::group(['prefix' => 'employeeMaster'], function () {
	Route::post('/updateAccountDetails/{id}', [EmployeeController::class, 'updateAccountDetails']);
	Route::post('/updatePasswordDetails/{id}', [EmployeeController::class, 'updatePasswordDetails']);
	Route::get('/', [EmployeeController::class, 'getData']);
	Route::get('/{id}', [EmployeeController::class, 'getById']);
	Route::post('/', [EmployeeController::class, 'postData']);
	Route::post('/{id}', [EmployeeController::class, 'putData']);
	Route::delete('/{id}', [EmployeeController::class, 'deleteData']);
});

//Status 
Route::group(['prefix' => 'statusMaster'], function () {
	Route::get('/getAllStatus/{tenantId}', [StatusController::class, 'getAllStatus']);
	Route::get('/getStatusById/{id}', [StatusController::class, 'getStatusById']);
	Route::post('createStatus/', [StatusController::class, 'createStatus']);
	Route::post('/updateStatus/{id}', [StatusController::class, 'updateStatus']);
	Route::delete('/deleteStatus{id}', [StatusController::class, 'deleteStatus']);
});


//DynamicForm
Route::group(['prefix' => 'dynamicFormMaster'], function () {
	Route::get('/getAllDynamicForm/{tenantId}', [DynamicFormController::class, 'getAllDynamicForm']);
	Route::get('/getDynamicFormById/{id}', [DynamicFormController::class, 'getDynamicFormById']);
	Route::post('createDynamicForm/', [DynamicFormController::class, 'createDynamicForm']);
	Route::post('/updateDynamicForm/{id}', [DynamicFormController::class, 'updateDynamicForm']);
	Route::delete('/deleteDynamicForm/{id}', [DynamicFormController::class, 'deleteDynamicForm']);
});


//Tenant tenantMaster
Route::group(['prefix' => 'tenantMaster'], function () {
	Route::get('/', [TenantController::class, 'getData']);
	Route::get('/{id}', [TenantController::class, 'getById']);
	Route::post('/', [TenantController::class, 'postData']);
	Route::post('/{id}', [TenantController::class, 'putData']);
	Route::delete('/{id}', [TenantController::class, 'deleteData']);
});

//CustomerMaster
Route::group(['prefix' => 'customerMaster'], function () {
	Route::get('/getAllCustomer/{tenantId}', [CustomerController::class, 'getAllCustomer']);
	Route::get('/getCustomerById/{id}', [CustomerController::class, 'getCustomerById']);
	Route::post('createCustomer/', [CustomerController::class, 'createCustomer']);
	Route::post('/updateCustomer/{id}', [CustomerController::class, 'updateCustomer']);
	Route::delete('/deleteCustomer/{id}', [CustomerController::class, 'deleteCustomer']);
});


//CustomerType
Route::group(['prefix' => 'customerTypeMaster'], function () {
	Route::get('/getAllCustomerType/{tenantId}', [CustomerTypeController::class, 'getAllCustomerType']);
	Route::get('/getCustomerTypeById/{id}', [CustomerTypeController::class, 'getCustomerTypeById']);
	Route::post('createCustomerType/', [CustomerTypeController::class, 'createCustomerType']);
	Route::post('/updateCustomerType/{id}', [CustomerTypeController::class, 'updateCustomerType']);
	Route::delete('/deleteCustomerType/{id}', [CustomerTypeController::class, 'deleteCustomerType']);
});

//Query Type 
Route::group(['prefix' => 'queryTypeMaster'], function () {
	Route::get('/getAllQueryType/{tenantId}', [QueryTypeController::class, 'getAllQueryType']);
	Route::get('/getQueryTypeExternally/{tenantId}', [QueryTypeController::class, 'getQueryTypeExternally']);
	Route::get('/getQueryTypeById/{id}', [QueryTypeController::class, 'getQueryTypeById']);
	Route::post('createQueryType/', [QueryTypeController::class, 'createQueryType']);
	Route::post('/updateQueryType/{id}', [QueryTypeController::class, 'updateQueryType']);
	Route::delete('/deleteQueryType/{id}', [QueryTypeController::class, 'deleteQueryType']);
	Route::get('/getQueryTypeForm/{tenant_id}/{id}', [QueryTypeController::class, 'getQueryTypeForm']);
});


Route::group(['prefix' => 'templateMaster'], function () {
	Route::get('getAllTemplate/{tenantId}', [TemplateController::class, 'getAllTemplate']);
	Route::post('/createTemplate', [TemplateController::class, 'createTemplate']);
	Route::get('/getTemplateById{id}', [TemplateController::class, 'getTemplateById']);
	Route::post('/updateTask/{id}', [TemplateController::class, 'updateTask']);
	Route::post('/deleteTask/{id}', [TemplateController::class, 'deleteTask']);
});

//Ticket ticketMaster
Route::group(['prefix' => 'ticketMaster'], function () {

	Route::post('createTicketThroughApi', [TicketController::class, 'createTicketThroughApi']);

	Route::post('getAllTicketNew', [TicketController::class, 'getAllTicketNew']);

	Route::post('/uploadBulkFormatTicket', [TicketController::class, 'uploadBulkFormatTicket']);
	Route::post('/getBulkFormat', [TicketController::class, 'getBulkFormat']);

	Route::post('/verifyTicketConfirmationOtp/{id}', [TicketController::class, 'verifyTicketConfirmationOtp']);
	Route::get('/sendTicketConfirmationOtp/{id}', [TicketController::class, 'sendTicketConfirmationOtp']);



	Route::get('/getAllTicketTest/{tenantId}/{id}', [TicketController::class, 'getAllTicketTest']);
	Route::post('/passTicket', [TicketController::class, 'passTicket']);
	Route::get('/dynamic', [TicketController::class, 'checkDynamicForm']);
	Route::get('/getAllTicket/{tenantId}/{id}', [TicketController::class, 'getAllTicket']);
	Route::get('/getTicketById/{id}', [TicketController::class, 'getTicketById']);
	Route::post('/createTicket', [TicketController::class, 'createTicket']);
	Route::post('/updateTicket/{id}', [TicketController::class, 'updateTicket']);
	Route::delete('/deleteTicket/{id}', [TicketController::class, 'deleteTicket']);
	Route::get('/getTicketHistory/{id}', [TicketController::class, 'getTicketHistory']);
});
Route::post('/ticketMaster/comment/createComment', [TicketController::class, 'createComment']);
Route::get('/ticketMaster/comment/getAllComment/{id}', [TicketController::class, 'getComment']);

Route::group(['prefix' => 'ticketBasket'], function () {
	Route::post('/updateBasket/{id}', [TicketBasketController::class, 'updateBasket']);
	Route::get('/', [TicketBasketController::class, 'getData']);
	Route::get('/{id}', [TicketBasketController::class, 'getById']);
	Route::post('/createBasket', [TicketBasketController::class, 'createBasket']);
	Route::delete('/{id}', [TicketBasketController::class, 'deleteData']);
	Route::get('{ticketId}/{userId?}', [TicketBasketController::class, 'ticketBasket']);
	Route::get('/ticketTask/{id}', [TicketBasketController::class, 'ticketTask']);
});

Route::group(['prefix' => 'ticketTask'], function () {
	Route::post('changeStatusRegularizationTime/', [TicketTaskController::class, 'changeStatusRegularizationTime']);
	Route::get('getRegularizationTime/{user_id}/{ticketId}', [TicketTaskController::class, 'getRegularizationTime']);
	Route::post('/requestRegularizationTime', [TicketTaskController::class, 'requestRegularizationTime']);
	Route::get('/apporvalRequestTime/{id}', [TicketTaskController::class, 'apporvalRequestTime']);
	Route::post('/apporvalRequestTime/{id}', [TicketTaskController::class, 'submitRequestTime']);

	Route::get('/addPlanner', [TicketTaskController::class, 'addPlanner']);
	Route::get('/', [TicketTaskController::class, 'getData']);
	Route::post('/', [TicketTaskController::class, 'postData']);
	Route::post('/addTask', [TicketTaskController::class, 'postData']);
	Route::post('/{id}', [TicketTaskController::class, 'putData']);
	Route::delete('/{id}', [TicketTaskController::class, 'deleteData']);
	Route::get('/{id}', [TicketTaskController::class, 'getById']);
	Route::get('userTask/{id}', [TicketTaskController::class, 'getUserTask']);
	Route::get('/ticketUser/{id}', [TicketTaskController::class, 'ticketUser']);
	Route::get('/ticketUser', [TicketTaskController::class, 'allTicketUser']);
	Route::get('/getTaskUser/{taskId}', [TicketTaskController::class, 'getTaskUser']);
	Route::post('/resourcePlanningUserTask', [TicketTaskController::class, 'resourcePlanningUserTask']);
	Route::get('/getTaskPlanner/{id}', [TicketTaskController::class, 'getTaskPlanner']);
	Route::post('/updateTaskPlanner/{id}', [TicketTaskController::class, 'updateTaskPlanner']);
	//Mobile Development
	Route::get('/ticketTask/{basket_id}', [TicketBasketController::class, 'taskDetails']);
});
Route::post('/resourcePlanningUserTask', [TicketTaskController::class, 'resourcePlanningUserTask']);

//SS
Route::post('taskOwnerTime', [TicketTaskController::class, 'getTaskOwnerTime']);
//SS
Route::post('/requestTime', [TicketTaskController::class, 'requestTime']);
Route::get('/apporvalRequestTime/{id}', [TicketTaskController::class, 'apporvalRequestTime']);
Route::post('/apporvalRequestTime/{id}', [TicketTaskController::class, 'submitRequestTime']);

Route::post('timerData', [TicketTaskTimerController::class, 'postTimerData']);
Route::post('postTimerDataGroupActivity', [TicketTaskTimerController::class, 'postTimerDataGroupActivity']);


Route::group(['prefix' => 'ticketSubtask'], function () {
	Route::get('/{id}', [TicketSubtaskController::class, 'getSubtask']);
	Route::post('/', [TicketSubtaskController::class, 'postSubtask']);
	Route::post('/completeSubtask/{id}', [TicketSubtaskController::class, 'completeSubtask']);
	Route::post('/deleteSubtask/{id}', [TicketSubtaskController::class, 'deleteSubtask']);
});

// Route::prefix('/ticketSubtask')->group(function () {
// 	Route::get('/', [TicketSubtaskController::class, 'getSubtask']);
// 	Route::get('/{id}', [TicketSubtaskController::class, 'getById']);
// 	Route::post('/', [TicketSubtaskController::class, 'postSubtask']);
// 	Route::put('/{id}', [TicketSubtaskController::class, 'putData']);
// 	Route::delete('/{id}', [TicketSubtaskController::class, 'deleteData']);
// });

// Route::prefix('/dashboard')->group(function () {
// 	Route::get('task/{userId}', [DashboardController::class, 'task']);
// });


Route::group(['prefix' => 'report'], function () {
	Route::post('userTaskReport', [ReportController::class, 'userTaskReport']);
	Route::post('ticketTimelineReport', [ReportController::class, 'ticketTimelineReport']);
	Route::post('resourcePlanning', [ReportController::class, 'resourcePlanning']);
	Route::post('ticketReport', [ReportController::class, 'ticketReport']);
	Route::post('getVariantsReport', [TicketTaskController::class, 'getVariantsReport']);
});

//Projects 
Route::group(['prefix' => 'projects'], function () {
	Route::get('/getClientData/{tenantId}', [ProjectsController::class, 'getClientData']);
	Route::get('/getAllProject/{tenantId}', [ProjectsController::class, 'getAllProject']);
	Route::get('/getProjectById/{id}', [ProjectsController::class, 'getProjectById']);
	Route::post('/createProject', [ProjectsController::class, 'createProject']);
	Route::post('/updateProject/{id}', [ProjectsController::class, 'updateProject']);
	//Route::put('/{id}', [ProjectsController::class, 'deleteData']);
	Route::post('/addProjectMapping', [ProjectsController::class, 'addProjectMapping']);
});

//Module 
Route::group(['prefix' => 'module'], function () {
	Route::get('/getAllModule/{tenantId}', [ModuleController::class, 'getAllModule']);
	Route::get('/getModuleSetting/{module_name}/{submodule_name}', [ModuleSettingController::class, 'getModuleSetting']);
	Route::get('/getModuleById/{id}', [ModuleController::class, 'getModuleById']);
	Route::post('/createModule', [ModuleController::class, 'createModule']);
	Route::post('/updateModule/{id}', [ModuleController::class, 'updateModule']);
	//Route::put('/{id}', [ModuleController::class, 'deleteData']);
});

//SubModule 
Route::group(['prefix' => 'submodule'], function () {
	Route::get('/getAllSubmodule/{tenantId}', [SubModuleController::class, 'getAllSubmodule']);
	Route::get('/getSubmoduleById/{id}', [SubModuleController::class, 'getSubmoduleById']);
	Route::post('/createSubmodule', [SubModuleController::class, 'createSubmodule']);
	Route::post('/updateSubmodule/{id}', [SubModuleController::class, 'updateSubmodule']);
	//Route::put('/{id}', [SubModuleController::class, 'deleteData']);
});


Route::group(['prefix' => 'consolidatedView'], function () {
	Route::get('getProjects/{tenant_id}', [ConsolidatedViewController::class, 'getProjects']);

	Route::get('getProjectsModules/{tenantId}/{projectId}/{moduleId}', [ConsolidatedViewController::class, 'getProjectsModules']);

	Route::get('getTicketData/{tenantId}/{projectId}/{type}', [ConsolidatedViewController::class, 'getTicketData']);
	Route::get('getTaskData/{tenantId}/{projectId}/{type}', [ConsolidatedViewController::class, 'getTaskData']);

	Route::get('getModulesTicketData/{tenantId}/{projectId}/{moduleId}/{type}', [ConsolidatedViewController::class, 'getModulesTicketData']);
	Route::get('getModulesTaskData/{tenantId}/{projectId}/{moduleId}/{type}', [ConsolidatedViewController::class, 'getModulesTaskData']);
});

//Module Settings
Route::group(['prefix' => 'moduleSetting'], function () {
	Route::post('/getSetting', [ModuleSettingController::class, 'getSetting']);
	Route::post('/addMod', [ModuleSettingController::class, 'addModules']);
	Route::get('/getSettingByName/{tenantId}/{module_name}/{submodule_name}', [ModuleSettingController::class, 'getSettingByName']);
	Route::get('/getAllModuleSetting/{tenantId}', [ModuleSettingController::class, 'getAllModuleSetting']);
	Route::post('/updateAllModuleSetting', [ModuleSettingController::class, 'updateAllModuleSetting']);
});

Route::group(['prefix' => 'errorLog'], function () {
	Route::post('/catchError', [ErrorLogController::class, 'catchError']);
});


Route::post('/mapping', [MappingController::class, 'postData']);
Route::post('/owner', [MappingController::class, 'owner']);

Route::group(['prefix' => 'connector'], function () {
	Route::post('/vendor', [ConnectorController::class, 'postVendor']);
	Route::post('/vendor/{id}', [ConnectorController::class, 'activeVendor']);
	Route::get('/vendor', [ConnectorController::class, 'getVendor']);
	Route::post('/connector', [ConnectorController::class, 'postConnector']);
	Route::get('/connector', [ConnectorController::class, 'getConnector']);
});

Route::group(['prefix' => 'testCases'], function () {
	// Route::post('/', [TestCaseController::class, 'postData']);
	// Route::get('/{module_id}/{submodule_id?}', [TestCaseController::class, 'getData']);
	// Route::delete('/{id}', [TestCaseController::class, 'deleteData']);
	// Route::get('/edit/{id}', [TestCaseController::class, 'getDataById']);
	Route::get('/getLastId/{ticket_id}/{task_id}', [TestCaseController::class, 'getLastId']);
	Route::post('/{user_id}/{ticketId}/{task_id?}', [TestCaseController::class, 'getTestCases']);
	Route::post('/submitTestCases', [TestCaseController::class, 'submitTestCases']);
	Route::post('/importTestCase', [TestCaseController::class, 'importTestCase']);
	Route::get('/getTestCaseHistory/{id}', [TestCaseController::class, 'getTestCaseHistory']);
	Route::get('/BulkFormat', [TestCaseController::class, 'BulkFormat']);
	
	Route::post('/updateTestCases/{id}', [TestCaseController::class, 'updateTestCases']);
});
Route::get('/BulkUploadFormat', [TestCaseController::class, 'BulkFormat']);
Route::group(['prefix' => 'customerMapping'], function () {
	Route::get('/getCustomerMappingById/{id}', [CustomerMappingController::class, 'getCustomerMappingById']);
	Route::get('/getAllCustomerMapping/{tenantId}', [CustomerMappingController::class, 'getAllCustomerMapping']);
	Route::post('/createCustomerMapping', [CustomerMappingController::class, 'createCustomerMapping']);
	Route::post('/updateCustomerMapping/{id}', [CustomerMappingController::class, 'updateCustomerMapping']);
	Route::get('/getUser/{tenant_id}/{query_type_id?}', [CustomerMappingController::class, 'getUser']);
	Route::get('/getCustomerMappingSettings/{tenant_id}/{user_id}/{query_type_id?}', [CustomerMappingController::class, 'getQuertyTypeCustomerMapping']);
	Route::get('/getCustomerMappingDynamicForm/{tenant_id}/{user_id}/{query_type_id?}', [CustomerMappingController::class, 'getCustomerMappingDynamicForm']);
	Route::get('/test/{tenant_id?}/{user_id?}', [CustomerMappingController::class, 'test']);
});

Route::group(['prefix' => 'whatsapp'], function () {
	Route::post('/', [WhatsappController::class, 'getIndex']);
});

Route::group(['prefix' => 'customReport'], function () {
	Route::post('/', [CustomReportController::class, 'buildQuery']);
});

Route::get('/getMenuByRoleId/{tenantId}/{roleId}', [MenuController::class, 'getMenuByRoleId']);

Route::group(['prefix' => 'menuManagement'], function () {
	Route::get('/getAllMenu/{tenantId}', [MenuController::class, 'getAllMenu']);
	Route::post('/createAccess', [MenuController::class, 'createAccess']);
	Route::get('/getRole/{roleId}', [MenuController::class, 'getRole']);
});


Route::group(['prefix' => 'departmentMapping'], function () {
	Route::get('getAllDepartmentMapping/{tenantId}', [DepartmentMappingController::class, 'getAllDepartmentMapping']);
	Route::post('/createDepartmentMapping', [DepartmentMappingController::class, 'createDepartmentMapping']);
	Route::get('/getDepartmentMappingByEmployeeId/{id}', [DepartmentMappingController::class, 'getDepartmentMappingByEmployeeId']);
	Route::get('/getDepartmentMappingById/{id}', [DepartmentMappingController::class, 'getDepartmentMappingById']);
	Route::post('/updateDepartmentMapping/{id}', [DepartmentMappingController::class, 'updateDepartmentMapping']);
});
Route::group(['prefix' => 'dynamicFormDropdownMaster'], function () {
	Route::get('getAllDynamicFormDropdown/{tenantId}', [DynamicFormDropdownMasterController::class, 'getAllDynamicFormDropdown']);
	Route::get('getAllDynamicFormDropdownData/{tenantId}/{dropdownId}', [DynamicFormDropdownMasterController::class, 'getAllDynamicFormDropdownData']);
	Route::post('createDropdown', [DynamicFormDropdownMasterController::class, 'createDropdown']);
	Route::get('getDropdownById/{dropdownId}', [DynamicFormDropdownMasterController::class, 'getDropdownById']);
	Route::get('getAllDropdown/{tenantId}', [DynamicFormDropdownMasterController::class, 'getAllDropdown']);
	Route::post('updateDropdown', [DynamicFormDropdownMasterController::class, 'updateDropdown']);
});


Route::group(['prefix' => 'billCheckingMaster'], function () {

	// DROPDOWN
	Route::post('getDropdowns', [BillTypeMasterController::class, 'getDropdowns']);
	Route::get('getPaymentStatusDropdown', [BillTypeMasterController::class, 'getPaymentStatusDropdown']);
	Route::get('getSectionDropdown', [BillTypeMasterController::class, 'getSectionDropdown']);
	Route::get('getSectionMappingDropdown/{id}', [BillTypeMasterController::class, 'getSectionMappingDropdown']);
	Route::get('getBillTypeMappedEmp/{id}', [BillTypeMasterController::class, 'getBillTypeMappedEmp']);


	// Bill Type Master
	Route::get('getBillTypeData/{tenantId}/{type?}', [BillTypeMasterController::class, 'getBillTypeData']); // get all data
	Route::get('getBillTypeDataById/{id}', [BillTypeMasterController::class, 'getBillTypeDataById']); // get singl record
	Route::post('createBillType', [BillTypeMasterController::class, 'createBillType']); //create
	Route::post('updateBillType/{id}', [BillTypeMasterController::class, 'createBillType']); // update
	// Route::get('getBillTypeHistoryById/{id}', [BillTypeMasterController::class, 'getBillTypeHistoryById']); // history by id
	// Route::get('getBillTypeHistory', [BillTypeMasterController::class, 'getBillTypeHistory']); // all history

	// bill type mapping
	Route::post('updateBillTypeMapping', [BillTypeMasterController::class, 'updateBillTypeMapping']); //update
	Route::get('getBillTypeMapping', [BillTypeMasterController::class, 'getBillTypeMapping']); // history by id

	// Payment template
	Route::get('getPaymentTemplate/{tenantId}/{type?}', [PaymentTemplateController::class, 'getPaymentTemplate']); //get all data
	Route::get('getPaymentTemplateById/{id}', [PaymentTemplateController::class, 'getPaymentTemplateById']); // get single data
	Route::post('createPaymentTemplate', [PaymentTemplateController::class, 'createPaymentTemplate']); // create
	Route::post('updatePaymentTemplate/{id}', [PaymentTemplateController::class, 'createPaymentTemplate']); //update
	Route::get('getPaymentTemaplteHistoryById/{id}', [PaymentTemplateController::class, 'getPaymentTemaplteHistoryById']); // history by id
	Route::get('getPaymentTemaplteHistory', [PaymentTemplateController::class, 'getPaymentTemaplteHistory']); // all history

	// Vendor Master
	Route::get('getVendorMaster/{tenantId}/{user_id}/{type?}', [VendorMasterController::class, 'getVendorMaster']); // get all data
	Route::get('getVendorMasterById/{id}', [VendorMasterController::class, 'getVendorMasterById']); //get single data
	Route::post('createVendorMaster', [VendorMasterController::class, 'createVendorMaster']); // create
	Route::post('updateVendorMaster/{id}', [VendorMasterController::class, 'createVendorMaster']); //update
	Route::get('getVendorMasterHistoryById/{id}', [VendorMasterController::class, 'getVendorMasterHistoryById']); // history by id
	Route::get('getVendorMasterHistory', [VendorMasterController::class, 'getVendorMasterHistory']); // all history

	// bill_checking transaction
	Route::get('getBillCheck/{tenantId}/{user_id}/{type?}', [BillCheckingTransaction::class, 'getBillCheck']); // get all data
	Route::get('getBillCheckById/{id}/{user_id}', [BillCheckingTransaction::class, 'getBillCheckById']); //get single data
	Route::post('createBillCheck', [BillCheckingTransaction::class, 'createBillCheck']); // create
	Route::post('updateBillCheck/{id}', [BillCheckingTransaction::class, 'updateBillCheck']); //update
	Route::get('getBillCheckHistoryById/{id}', [BillCheckingTransaction::class, 'getBillCheckHistoryById']); // history by id
	Route::get('getBillCheckHistory', [BillCheckingTransaction::class, 'getBillCheckHistory']); // all history

	// assign person details
	Route::get('getAssignPersonDetail/{id}', [BillCheckingTransaction::class, 'getAssignPersonDetail']); // all history
	

	// payment details
	Route::get('getPaymentDetails/{id}/{user_id}', [BillCheckingTransaction::class, 'getPaymentDetails']); //update
	Route::post('updatePaymentDetails', [BillCheckingTransaction::class, 'updatePaymentDetails']); //update

	// module settings
	Route::get('getModuleSetting/{type?}', [BillCheckAuthority::class, 'getModuleSetting']);
	Route::get('getModuleSettingById/{id}', [BillCheckAuthority::class, 'getModuleSettingById']);

	// bill paymnets
	Route::post('getBillPayment/{user_id}', [BillPayment::class, 'getBillPayment']); // get payment

	Route::post('getExport', [BillPayment::class, 'getExport']); // get export
	Route::post('postDownloadFile', [BillPayment::class, 'postDownloadFile']); // Download text file
	Route::post('postPaymentUpdate', [BillPayment::class, 'postPaymentUpdate']); // upload excel file
	Route::post('isCancelBill', [BillPayment::class, 'isCancelBill']); // upload excel file

	

});
