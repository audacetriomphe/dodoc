
// en cours : gestion des modals. Elles s'ouvrent avec un trigger sur $(document), qui passe les données à afficher dedans
var modals = (function() {

  var API = {

    init : function() {

      console.log('Modals.init()');

      modals.statusChangeAlertInit();
      modals.removeProjectInit();

      	$('body').on('click', '.js--add-project', function(){
      		modals.createProjectPopup();
      	});
      	$('body').on('click', '.js--edit-project', function(){
      		var $thisProject = $(this).closest(".project");
      		modals.editProjectPopup( $thisProject);
      	});

      	$('body').on('click', '.js--createPublication', function(){
      		modals.createPubliPopup();
      	});
      	$('body').on('click', '.js--editPubli', function(){
      		var pdata = $(this).closest("[data-publidata]").data();
      		modals.editPubliPopup(pdata);
      	});

    },

    createProjectPopup : function() {

      var $modal = $("#modal-add-project").empty();
      var $modalContent = $modal.next().clone(false);
      $modal.append( $modalContent.show());

      $modal.foundation('reveal', 'open');

      	var $filePicker = $modal.find('.js--modal_inputfile');
      	var $label = $filePicker.next().find('span');
      	var labelVal = $label.text();

      	$filePicker.on( 'change', function( e )
      	{
      		var fileName = '';
    			fileName = e.target.value.split( '\\' ).pop();

    			var fileData = e.originalEvent.target.files;

      		if( fileName ) {
      			$(this)
      			  .data('fileName', fileName)
      			  .data('fileData', fileData)
      			  ;
      			$label
    			    .html( fileName)
              ;
      		} else
      			$(this)
      			  .data('fileName', '')
      			  .data('fileData', '')
      			  ;
      			$label.innerHTML = labelVal;
      	});


      $modal.find(".js--modal_submit").on('click', function(){
        	var newProjectName = $modal.find('.js--modal_name').val();
        	var fileData = $filePicker.data( "fileData");
        	//Images changed

        	if( fileData !== undefined && fileData !== null){
        		console.log('Une image a été ajoutée');
        		var f = fileData[0];
        		var reader = new FileReader();
        		reader.onload = function(evt){
        			var newProjectData =
        			{
         				"projectName" : newProjectName,
        				"imageData" : evt.target.result
        		  }
        		  sendData.createNewProject( newProjectData);
        		};
        		reader.readAsDataURL(f);
        	}
        	else{
        		console.log("Pas d'image chargé");
      			var newProjectData =
            {
         				"projectName" : newProjectName,
        		}
      		  sendData.createNewProject( newProjectData);
        	}
        $modal.foundation('reveal', 'close');
      });
    },

    editProjectPopup : function($project) {
      var $modal = $("#modal-modify-project");
      $modal
        .empty()
        ;

      var $modalContent = $(".modal-modify-project_content").clone(false);
      $modal
        .append( $modalContent.show())
        ;

      $modal.foundation('reveal', 'open');

      var pdata = $project.data();
      $modal
        .find(".js--modal_name")
          .attr( "value", pdata.projectName)
        .end()
        .find(".modify-project-statut option")
          .filter("[value='" + pdata.statut + "']")
            .attr('selected', '')
          .end()
        .end()
        ;

      	var $filePicker = $modal.find('.js--modal_inputfile');
      	var $label = $filePicker.next().find('span');
      	var labelVal = $label.text();

      	$filePicker.on( 'change', function( e )
      	{
      		var fileName = '';
    			fileName = e.target.value.split( '\\' ).pop();

    			var fileData = e.originalEvent.target.files;

      		if( fileName ) {
      			$(this)
      			  .data('fileName', fileName)
      			  .data('fileData', fileData)
      			  ;
      			$label
    			    .html( fileName)
              ;
      		} else
      			$(this)
      			  .data('fileName', '')
      			  .data('fileData', '')
      			  ;
      			$label.innerHTML = labelVal;
      	});

      	var $deleteModal = $('#modal-deleteproject-alert');
      	$deleteModal.data('slugProjectName', pdata.slugProjectName)

      	//Au click sur le bouton supprimer le dossier
      	$modal.find('.js--deleteProject').on('click', function(){
      		$deleteModal.foundation('reveal', 'open');
      	});

      	$modal.find('.modify-project-statut').bind('change', function(){
        	$alertModal = $('#modal-statut-alert');
        	$statutField = $(this);
      		if( $statutField.val() === "terminé"){
      			$alertModal.foundation('reveal', 'open');
      			$alertModal.find('button.oui').on('click', function(){
      				$alertModal.foundation('reveal', 'close');
      				$modal.foundation('reveal', 'open');
      			});
      			$alertModal.find('button.annuler').on('click', function(){
      				console.log('non');
      				$statutField.val('en cours');
      				$alertModal.foundation('reveal', 'close');
      				$modal.foundation('reveal', 'open');
      			});
      		}
      	});

      $modal.find(".js--modal_submit").on('click', function(){
      	var newProjectName = $modal.find('.js--modal_name').val();
      	var newStatut = $modal.find('.modify-project-statut').val();
      	var fileData = $filePicker.data( "fileData");
      	//Images changed

      	if( fileData !== undefined && fileData !== null){
      		console.log('Une image a été ajoutée');
      		var f = fileData[0];
      		var reader = new FileReader();
      		reader.onload = function(evt){
        		var projectData =
      			{
       				"name" : newProjectName,
              "slugProjectName" : pdata.slugProjectName,
      				"statut" : newStatut,
      				"imageData" : evt.target.result
      		  }
      		  sendData.editProject( projectData);
      		};
      		reader.readAsDataURL(f);
      	}
      	else{
      		console.log("Pas d'image chargé");
      		var projectData =
          {
       				"name" : newProjectName,
              "slugProjectName" : pdata.slugProjectName,
      				"statut" : newStatut,
      		}
    		  sendData.editProject( projectData);
      	}
        $modal.foundation('reveal', 'close');
      });
    },

    createPubliPopup : function() {

      var $modal = $("#modal-add-publi").empty();
      var $modalContent = $modal.next().clone(false);
      $modal.append( $modalContent.show());
      $modal.foundation('reveal', 'open');

      $modal.find(".js--modal_submit").on('click', function(){

        	var newPubliName = $modal.find('.js--modal_name').val();
        	var newPubliTemplate = $modal.find('.js--modal_template:checked').val();

      		if( newPubliName.length > 0) {
        		var newPubliData = {
          		"publiName" : newPubliName,
          		"template" : newPubliTemplate
        		}
      		  sendData.createNewPubli( newPubliData);
        }
        $modal.foundation('reveal', 'close');
      });
    },

    editPubliPopup : function(pdata) {

      var $modal = $("#modal-modify-publi").empty();
      var $modalContent = $modal.next().clone(false);
      $modal.append( $modalContent.show());
      $modal.foundation('reveal', 'open');

      $modal
        .find(".js--modal_name")
          .attr( "value", pdata.name)
        .end()
        .find(".js--modal_template")
          .prop("checked", false)
          .filter("[value='" + pdata.template + "']")
            .prop("checked", true)
          .end()
        .end()
        ;

      $modal.find(".js--modal_submit").on('click', function(){
        	var newName = $modal.find('.js--modal_name').val();
        	var newTemplate = $modal.find('.js--modal_template:checked').val();
      		var publiData =
        {
          "name" : newName,
          "slugPubliName" : pdata.publishown,
          "template" : newTemplate,
          "slugProjectName" : pdata.slugProjectName
      		}
    		  sendData.editPubliMeta( publiData);
        $modal.foundation('reveal', 'close');
      });
    },

    bigMedia : function( $m) {

      var $modal = $('#modal-media-view');
      var $modalContent = $modal.find('.big-mediaContent');
      var mdata = $m.data();

      var $nextm = $m.next('.media');
      var $prevm = $m.prev('.media');

      var $navNextMedia = $modal.find('.js--big-mediaNav-next');
      var $navPrevMedia = $modal.find('.js--big-mediaNav-prev');

      // arrow logic
      _setBigmediaArrow($modalContent, $nextm, $navNextMedia);
      _setBigmediaArrow($modalContent, $prevm, $navPrevMedia);

      var mtype = mdata.type;
      var minfos = mdata.informations;
      var mname = mdata.medianame;
      var mfullsizeimagesrc = mdata.imagesrc_fullsize;

      	$modal.foundation('reveal', 'open');

      switch( mtype){
      		case dodoc.projectPhotosFoldername:
    				var $mediaItem = $(".js--templates .media-big_image").clone(false);
          var mfullpath = app.contentDir+'/'+mfullsizeimagesrc;

    				$mediaItem
    					.find( 'img')
    					  .attr('src', mfullsizeimagesrc)
    					.end()
    					;
    				break;
    			case dodoc.projectVideosFoldername:

    				var videoPath = $m.find("source").attr("src");
    				var $mediaItem = $(".js--templates .media-big_video").clone(false);
          var mfullpath = app.contentDir+'/'+videoPath;

    				$mediaItem
    			    .find( 'video')
    			      .attr( 'poster', mfullsizeimagesrc)
    			      .attr( 'preload', 'auto')
      			    .find( 'source')
      			      .attr( 'src', videoPath)
    					;

    				break;
    			case dodoc.projectAnimationsFoldername:

    				var videoPath = $m.find("source").attr("src");
    				var $mediaItem = $(".js--templates .media-big_stopmotion").clone(false);
          var mfullpath = app.contentDir+'/'+videoPath;

    				$mediaItem
    			    .find( 'video')
    			      .attr( 'poster', mfullsizeimagesrc)
    			      .attr( 'preload', 'auto')
      			    .find( 'source')
      			      .attr( 'src', videoPath)
    					;
    				break;
    			case dodoc.projectAudiosFoldername:

    				var audioPath = $m.find("source").attr("src");
    				var $mediaItem = $(".js--templates .media-big_audio").clone(false);
          var mfullpath = app.contentDir+'/'+audioPath;

    				$mediaItem
    					.find( 'img')
    					  .attr('src', mfullsizeimagesrc)
    					.end()
    			    .find( 'source')
    			      .attr( 'src', audioPath)
    			    .end()
    					;
    				break;
    			case dodoc.projectTextsFoldername:
    				//console.log($(this).find('h3').html());
    				var $mediaItem = $(".js--templates .media-big_text").clone(false);
          var mfullpath = app.contentDir+'/'+mdata.textFilePath;

      				$mediaItem
      					.find('.js--submit-new-text_text')
      					  .val( mdata.originalText)
      					.end()
      					;
      				break;
      	}

    		if( $m.hasClass('is--highlight')){
    			$mediaItem.addClass('is--highlight');
    		}

      mfullpath = mfullpath.replace(/\//g, '\u200B\/');

      	$mediaItem
      	  .attr( 'data-medianame', mname)
      	  .attr( 'data-mediatype', mtype)
      	  .find('.js--mediaInformations')
      	    .val( minfos)
        .end()
        .find('.js--mediaFullPath')
          .text(mfullpath)
        .end()
        ;

      // animate the inside : set $modalContent to opacity 0
      $modalContent.css('opacity',0);

      setTimeout(function() { $modalContent.html( $mediaItem); $modalContent.css('opacity',1); }, 125);

      //Envoie les titres et légendes au serveur
      $mediaItem.find('.js--submit-add-media-data').on( 'click', function(){
        var editMediaData =
        {
          "mediaName" : mname,
          "mediaFolderPath" : mtype,
        };
      		var informations = $modal.find( '.js--mediaInformations').val();
          if( informations !== undefined && informations.length > 0)
            editMediaData.informations = informations;
        sendData.editMedia( editMediaData);
      		$modal.foundation('reveal', 'close');
      		$modalContent.empty();
      });

      // Ajoute ou enlève un highlight quand on clique sur "Highlight" dans la fenêtre modal
      $mediaItem.find('.js--highlightMedia').on( 'click', function(){
    		// trigger a click on its js--flagMedia
        var editMediaData =
        {
          "mediaName" : mname,
          "mediaFolderPath" : mtype,
          "switchFav" : true
        };
        sendData.editMedia( editMediaData);

        $mediaItem.toggleClass( 'is--highlight');

      });

      // text modal only
      $mediaItem.find('.js--submit-view-text-modify').on( 'click', function(){

        var editMediaData =
        {
          "mediaName" : mname,
          "mediaFolderPath" : mtype,
        };

        	var textOfTextmedia =  $modal.find('.js--submit-new-text_text').val();

        if( textOfTextmedia !== undefined)
          editMediaData.textOfTextmedia = textOfTextmedia;

        sendData.editMedia( editMediaData);

        $modal.foundation('reveal', 'close');
      		$modalContent.empty();

      });


      $mediaItem.find('.js--delete-media-bibli').on( 'click', function(){

        $alertModal = $('#modal-delete-alert-media');

        	$modal.foundation('reveal', 'close');
        	$alertModal.foundation('reveal', 'open');

        $alertModal.find('button.oui').on('click', function(){
          var mediaToDelete =
          {
            "mediaName" : mname,
            "mediaFolderPath" : mtype,
          }
          sendData.deleteMedia( mediaToDelete);
        		$alertModal.foundation('reveal', 'close');
          $modalContent.empty();
        	});
        	$alertModal.find('button.annuler').on('click', function(){
        		$alertModal.foundation('reveal', 'close');
        		$modal.foundation('reveal', 'open');
        	});
      });

    },


    createTextMedia : function() {

      var $modal = $('#modal-add-text');
      var $textf = $modal.find('.js--submit-new-text_text');

      $('.js--submit-new-text').on('click',function(){

      	var textContent = $textf.val();

        var mediaData =
        {
          "mediaType" : "text",
          "mediaFolderPath" : dodoc.projectTextsFoldername,
          "text" : textContent,
        }
        sendData.createNewMedia( mediaData);

        $modal.foundation('reveal', 'close');
        $textf.val('');

      });
    },

    importNewMedia : function() {

      var $modal = $('#modal-add-local');

    	var $filePicker = $modal.find('.js--modal_inputfile');
    	var $label = $filePicker.next().find('span');
    	var labelVal = $label.text();

    	$filePicker.on( 'change', function( e )
    	{
    		var fileName = '';
  			fileName = e.target.value.split( '\\' ).pop();

  			var fileData = e.originalEvent.target.files;

    		if( fileName ) {
    			$(this)
    			  .data('fileName', fileName)
    			  .data('fileData', fileData)
    			  ;
    			$label
  			    .html( fileName)
            ;
    		} else {
    			$(this)
    			  .data('fileName', '')
    			  .data('fileData', '')
    			  ;
    			$label.html( labelVal);
    		}
    	});

      $modal.find('.js--modal_submit').on('click',function(){
      	var fileName = $filePicker.data( 'fileName');
      	var fileData = $filePicker.data( 'fileData');
      	//Images changed

      	if( fileData !== undefined && fileData !== null){
      		console.log('An image has been imported');
      		var f = fileData[0];
      		var reader = new FileReader();
      		reader.onload = function(evt){
        		// check type of content
        		console.log( fileName);
        		fileName = fileName.toLowerCase();

            if( fileName.indexOf( ".jpg") !== -1 || fileName.indexOf( ".jpeg") !== -1 || fileName.indexOf( ".png") !== -1) {
        			var mediaData =
        			{
                "mediaType" : "photo",
        				"mediaData" : evt.target.result
        		  }
        		} else if( fileName.indexOf( ".mp4") !== -1 ||  fileName.indexOf( ".webm")) {
        			var mediaData =
        			{
                "mediaType" : "video",
        				"mediaData" : evt.target.result
        		  }
        		}

        		if( mediaData !== undefined)
        		  sendData.createNewMedia( mediaData);

      		};
      		reader.readAsDataURL(f);
      	}

        // then remove $filePicker data fileName and fileData, and label
        $filePicker
  			  .data('fileName', '')
  			  .data('fileData', '')
  			  ;
  			$label.html( labelVal);
        $modal.foundation('reveal', 'close');
      });
    },

    statusChangeAlertInit : function() {
      // TODO
      $statusPopup = $('#modal-deletefolder-alert');
    	$('#modal-modify-project .modify-statut').bind('change', function(){
    		if($(this).val() == "terminé"){
    			$('#modal-statut-alert').foundation('reveal', 'open');
    			$('#modal-statut-alert button.oui').on('click', function(){
    				console.log('oui ');
    				$('#modal-statut-alert').foundation('reveal', 'close');
    				$("#modal-modify-project").foundation('reveal', 'open');
    			});
    			$('#modal-statut-alert button.annuler').on('click', function(){
    				console.log('non');
    				$('#modal-modify-project .modify-statut').val('en cours');
    				$('#modal-statut-alert').foundation('reveal', 'close');
    				$("#modal-modify-project").foundation('reveal', 'open');
    			});
    			$(document).on('closed.fndtn.reveal', '#modal-statut-alert[data-reveal]', function () {
    	  		$("#modal-modify-project").foundation('reveal', 'open');
    			});
    		}
    	});
    },

    removeProjectInit : function() {
      	var $deleteModal = $('#modal-deleteproject-alert');
      	$deleteModal.find('button.oui').on('click', function(){
        	var slugProjectName = $deleteModal.data('slugProjectName');
        	var slugFolderName = currentFolder;
      		socket.emit('removeOneProject',
      		{
        		"slugFolderName" : slugFolderName,
        		"slugProjectName" : slugProjectName
          });
      		$deleteModal.foundation('reveal', 'close');
      	});
      	$deleteModal.find('button.annuler').on('click', function(){
      		console.log('annuler');
      		$deleteModal.foundation('reveal', 'close');
      		$(document).on('close.fndtn.reveal', '#modal-delete-alert[data-reveal]', function () {
      	  	$('#modal-modify-project').foundation('reveal', 'open');
      		});
      	});
    },
  }


  function _setBigmediaArrow($modalContent, $upcomingMedia, $navUpcomingMedia) {
    if($upcomingMedia.length) {
      $navUpcomingMedia
        .removeClass('is--disabled')
        .off()
        .on('click', function() {
        		$modalContent.empty();
          modals.bigMedia($upcomingMedia);
        })
        ;
    } else {
      $navUpcomingMedia
        .addClass('is--disabled')
        .off()
        ;
    }
  }

  return API;
})();

modals.init();
