/**
 * Created by Avi on 26/02/2016.
 */

window.socialGraph.impl.linkedin =
(function () {
    "use strict";

    return {
        success : function(rsp){
            var socialReadyObj = {};
            try{
                socialReadyObj.share = rsp.count;
            }
            catch(err){
                return ({ERROR : "There was an error trying to extracting social data for linkedin"});
            }

            return socialReadyObj;
        },

    };

})();


