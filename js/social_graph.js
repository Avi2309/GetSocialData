/**
 * Created by Avi on 25/02/2016.
 */

window.socialGraph = {};
window.socialGraph.impl = {};

(function () {
    "use strict";

    var ns = window.socialGraph;
    
    //allowed providers ... we can add more providers to this list
    ns.providers = ["facebook", "linkedin", "pinterest", "twitter"];

    
    ns.providersApi = {
        "facebook" : "https://api.facebook.com/method/links.getStats?urls={{url}}&format=json&callback=?",
        "linkedin" : "https://www.linkedin.com/countserv/count/share?url={{url}}&format=jsonp&callback=?",
        "pinterest" : "https://api.pinterest.com/v1/urls/count.json?url={{url}}&format=json&callback=?",
    }


    /*public function for interaction and get params from user.
      cause we cant do function overloading i decide to expose one function which manages  
      the interaction and call three types of functions as you wish.
    */
    ns.manageSocialData = function (provider, pageurl, callback) {

        try{
            
            if ($.isArray(provider) && $.isArray(pageurl))
            {
                getSocialCountMultiProvAndUrl(provider, pageurl, callback);
            }
            else if($.isArray(pageurl))
            {
                getSocialCountMultiUrl(provider, pageurl, callback);
            }
            else
            {
                getSocialCount(provider, pageurl, callback);
            }
        }
        catch (err) {
            var resultObj = {"ERROR" : err};
            callback(resultObj);
        }

    };


    // this function is for case which user send 1 provider & pageurl
    var getSocialCount = function(provider, pageurl, callback){
        
        var resultObj = {};
        var extractedObj = {};
        
        //wait for all promises to be resolved and after it execute a function 
        $.when(ajaxCall(provider, pageurl))
        .done(function(rsp) {
            //get customed object according to the provider
            extractedObj = extractDataFromAjaxRes(provider, rsp);
            //prepare the res obj which will be returned
            resultObj[provider] = extractedObj;

        })
        .fail(function(){ 
            resultObj = {"ERROR" : "error trying to get social data"};
        })
        .always(function(){
            callback(resultObj);
        });
    }

    //this function is for one provider and multiple pageurls
    var getSocialCountMultiUrl = function(provider, pageurls, callback){

        var ajaxCallsList  = [];
        var resultObj = {};
        var resValueList = [];
        var extractedObj = {};

        //here we need to aggregate arbitrary ajax calls to be executed
        $(pageurls).each(function(pageUrlIndex){
            ajaxCallsList.push(ajaxCall(provider, pageurls[pageUrlIndex])) ;
        });

        //take all the ajax calls list and when all calls will be resolved/rejected do next section in 'done' callback
        $.when.apply(null,ajaxCallsList)
        .done(function() {

            //for each of the ajax resp call the provider specific exctraction method and push it into a list
            $(arguments).each(function(index,rsp){
                extractedObj = extractDataFromAjaxRes(provider, rsp[0][0]);
                resValueList.push(extractedObj);
            });
            //we have one provider so set the objects list into one key provider.
            resultObj[provider] = resValueList;
            
        })
        .fail(function(){ 
            resultObj = {"ERROR" : "error trying to get social data"};
        })
        .always(function(){
            callback(resultObj);
        });

    };


    //this function is for multiple providers & pageurls
    var getSocialCountMultiProvAndUrl = function(provider, pageurls, callback){

        var ajaxCallsList  = [];
        var resultObj = {};
        var extractedObj = {};

        /*here we need to aggregate arbitrary ajax calls to be executed. notice that
        we need to map one provider with the parallel page url in te second list*/
        $(provider).each(function(providerIndex){
            ajaxCallsList.push(ajaxCall(provider[providerIndex], pageurls[providerIndex])) ;
        });

        $.when.apply(null, ajaxCallsList)
        .done(function() {
            $(arguments).each(function(index,rsp){
                extractedObj = extractDataFromAjaxRes(provider[index], rsp[0][0]);
                resultObj[provider] = extractedObj;
            });
            
        }).fail(function(){ 
            resultObj = {"ERROR" : "error trying to get social data"};
        })
        .always(function(){
            callback(resultObj);
        });

    };
    
    //this function is responsible for get ajax response and execute success function implemented differently in each of the providers
    var extractDataFromAjaxRes = function(provider, rsp){
        
        //execute the suitable success function according to the provider and return the result obj
        var finalObj = window.socialGraph.impl[provider].success(rsp);
        return finalObj;
    };


    //function utility for inject the pageurl into the api template and make an ajax (GET) call 
    var ajaxCall = function(provider, pageUrl){
        
        //check if the input provider is exist in the providers list and if not throw an exception
        if (ns.providers.indexOf(provider) == -1) {
            throw "There is no such provider name : " + provider;
        }
        //match the correlating provider api template and inject the pageurl input
        var resCallUrl =  ns.providersApi[provider].replace("{{url}}", pageUrl);
        return $.getJSON( resCallUrl );
    };

})();


