/**
 * Created by Avi on 26/02/2016.
 */

window.socialGraph.impl.pinterest =
(function () {
    "use strict";

    return {
        success : function(rsp){
            var socialReadyObj = {};
            try{
                socialReadyObj.pins = rsp.count;
            }
            catch(err){
                return ({ERROR : "There was an error trying to extracting social data for pinterest"});
            }

            return socialReadyObj;
        },

    };

})();

