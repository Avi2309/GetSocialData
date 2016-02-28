/**
 * Created by Avi on 26/02/2016.
 */

window.socialGraph.impl.facebook =
(function () {
    "use strict";

    return {
        success : function(rsp){
            var socialReadyObj = {};
            try{
                var dataObj = rsp[0];
                socialReadyObj.likes = dataObj.like_count;
                socialReadyObj.shares = dataObj.share_count;
                socialReadyObj.comments = dataObj.comment_count;
            }
            catch(err){
                return ({ERROR : "There was an error trying to extracting social data for facebook"});
            }

            return socialReadyObj;
        },
    };
})();

