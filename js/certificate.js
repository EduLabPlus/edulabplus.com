jQuery(document).ready(function($) {
"use strict";

    var options = $("select.student_name option");
    options.detach().sort(function(a,b) {
        var at = $(a).text();
        var bt = $(b).text();
        return (at > bt) ? 1: ((at < bt) ? -1 : 0);
    });
    options.appendTo("select.student_name");
    $('select.student_name').prepend("<option value=''>Select Student</option>");
    $('form.certificateForm').find("select[name='studentName']").val('');

    $('form.certificateForm').submit(function(){
        var formData = $(this).serialize();
        $.ajax({
            type: "GET",                
            url: 'https://htmlservice.herokuapp.com/api/edulabplus/expo/certificate',				
            data: formData,
            xhrFields: {
                responseType: 'blob'
            },
            beforeSend: function(){
                $('#loading').addClass("d-block").removeClass("d-none");
            },
            success: function(blob, status, xhr) {
                // check for a filename
                var filename = $('form.certificateForm').find("select[name='studentName']").val();
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);
        
                    if (filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                         //   window.location.href = downloadUrl;
                            window.open(downloadUrl,"_blank");
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        //window.location.href = downloadUrl;
                        window.open(downloadUrl,"_blank");
                    }
        
                    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                }
                $("#sendmessage").addClass("d-block");
                $("#errormessage").removeClass("d-block");
                $('#loading').removeClass("d-block").addClass("d-none");
            },
            error: function() {
               $("#sendmessage").removeClass("d-block");
               $("#errormessage").addClass("d-block");
               $('#errormessage').html("Error occurred. Please try again");
               $('#loading').removeClass("d-block").addClass("d-none");
            }
        }).always(function(){				
            $('form.certificateForm').find("select[name='studentName']").val('');
        });
       return false;
    });

});