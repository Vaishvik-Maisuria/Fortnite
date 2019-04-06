import $ from 'jquery'

export function updateDatabase (data){
    var check = data
    // check['userName'] = data.userName
    // console.log(check);
    // console.log('Before updating score');
    
    $.ajax({
			type: "PUT",
			url: '/api/user/addKills/user=' + data.userName,
			contentType: "application/json",
      data: check, // serializes the form's elements.
      success: function(){
        console.log('complete')
      },
      async: false
	});

}