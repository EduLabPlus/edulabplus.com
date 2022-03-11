function downloadCertificate() {
    var formData = $('form.certificateForm').serialize();	
        $.ajax({
            type: "POST",                
            url: 'https://htmlservice.herokuapp.com/api',				
            data: formData});
            }