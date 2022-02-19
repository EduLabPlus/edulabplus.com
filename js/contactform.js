jQuery(document).ready(function($) {
"use strict";

    //Contact
    $('form.contactForm').submit(function(){
        var formData = $(this).serialize();		
            $.ajax({
                type: "POST",                
				url: 'https://htmlservice.herokuapp.com/api/edulabplus/contact',				
                data: formData,	
                beforeSend: function(){
                    $('#loading').addClass("show").removeClass("hide");
                 },		
				success: function(data) {				                   
                   $("#sendmessage").addClass("show");			
                   $("#errormessage").removeClass("show");     
				   $('#loading').removeClass("show").addClass("hide");
                },
				error: function() {
				   $("#sendmessage").removeClass("show");
                   $("#errormessage").addClass("show");
                   $('#errormessage').html("Error Occurred");
				   $('#loading').removeClass("show").addClass("hide");
				}
            });
        return false;
    });	
		
});