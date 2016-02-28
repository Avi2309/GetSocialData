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
                socialReadyObj.likes = rsp.like_count;
                socialReadyObj.shares = rsp.share_count;
                socialReadyObj.comments = rsp.comment_count;
            }
            catch(err){
                return ({ERROR : "There was an error trying to extracting social data for facebook"});
            }

            return socialReadyObj;
        },
    };
})();

