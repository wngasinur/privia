
exports.queryConditions = function(req) {
    var conditions = [];
    for(i=0;i<5;i++) {
        var val = req.query['sSearch_'+i];
        var col = req.query['mDataProp_'+i];
        if(val)
            conditions.push({'col':col,'val':val});
    }
    return conditions;
}
