function BlogPosts()
{
	$("#blogPosts").empty();
	fetch('/api/blog-posts')			
		.then( response => {		

			if ( response.ok ){		
				return response.json();
			}

			throw new Error (response.statusText);
		})
		.then( responseJSON => {
			console.log(responseJSON);
			for ( let i = 0; i < responseJSON.length; i ++ )
			{
				$('#blogPosts').append(`<li> ID: ${responseJSON[i].id}<p> Title: ${responseJSON[i].title}</p> Content: ${responseJSON[i].content}<p> Author: ${responseJSON[i].author}</p><p>
											<p> Published date: ${responseJSON[i].publishDate}</p></li> <hr> <p></p>`);
			}
		})
		.catch( err => {
			console.log(err);
	});

}

function Post()
{
	BlogPosts();
	$("#Posts").on("submit", function(event) 
	{
        event.preventDefault();
 	    let nTitle = $("#Title").val();
	    let nContent = $("#Content").val();
	    let nAuthor = $("#Author").val();
	    let nDate = $("#Date").val();
	
	    $.ajax({
	    	url: "/api/blog-posts",
			data: JSON.stringify(
			{
				title: nTitle,
				author: nAuthor,
				content: nContent,
				publishDate: nDate
			}),
			method : "POST",
			dataType : "json",
			contentType: "application/json",
			sucess: function(responseJSON)
			{
				console.log(responseJSON);
	            	
			},
			error: function(err)
			{
				$(".PError").text(err.statusText);
				$(".PError").show();
	            	
			}
	    });	
	    BlogPosts();
	    cleanPost();
    });

    

}

function Update()
{

	$("#Updatepost").on("submit", function(event) 
    {
        event.preventDefault();

        let updateId = $("#UID").val();
        let updateTitle = $("#UTitle").val();
        let updateContent = $("#UContent").val();
        let updateAuthor = $("#UAuthor").val();
        let updateDate = $("#UDate").val();

       


        $.ajax({
        	url : "/api/blog-posts/" + updateId ,
        	data: JSON.stringify({
        		id: updateId,
        		title: updateTitle != " " && updateTitle != "" ? updateTitle : undefined,
        		content: updateContent != " " && updateContent != "" ? updateContent : undefined,
        		author: updateAuthor != " " && updateAuthor != "" ? updateAuthor : undefined,
        		publishDate: updateDate
        	}),
			method : "PUT",
			dataType : "json",
			contentType: "application/json",
			success : function(responseJSON)
			{
				BlogPosts();
				console.log("SUCCESSS");
			},
			error : function(err)
			{
				$(".UpError").text(err.statusText);
				$(".UpError").show();
			}
			
        });
        cleanUpdate();
        
        
    });
}

function Delete()
{
	$("#Deletepost").on("submit", function(event) 
    {
    	event.preventDefault();
    	let idDelete= $("#DId").val();
    	console.log(idDelete);
    	$.ajax(
    	{
			url : "/api/blog-posts/" + idDelete,
			method: "DELETE",
			dataType: "json",
			contentType: "application/json",
			success: function(responseJSON)
			{
				$("#deleteForm").remove();
			},
			error: function(err)
			{
				$(".DelError").text(err.statusText);
				$(".DelError").show();
			}
		});
		BlogPosts();
		cleanDelete();
		
	});
}

function cleanPost()
{
	$("#Title").val("");
	$("#Content").val("");
	$("#Author").val("");
	$("#Date").val("");
	$(".PError").hide();
}

function cleanUpdate()
{
	$("#UID").val("");
    $("#UTitle").val("");
    $("#UContent").val("");
    $("#UAuthor").val("");
    $("#UDate").val("");
    $(".UpError").hide();

}


function cleanDelete()
{
	$("#DId").val("");
	$(".DelError").hide();
}



Post();
Update();
Delete();

