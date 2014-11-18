 var calculateIndex = function calculateIndex(indicators){
    if(!indicators ||indicators.length == 0){
        return 0;
    }

    var promoters = 0;
    var detractors = 0
    var passives = 0;

    indicators.forEach(function(indicator){
        if(indicator > 0)
            promoters++;
        if(indicator < 0)
            detractors++;
        if(indicator == 0)
            passives++;
    });

    var percentagePromoters = promoters / indicators.length * 100;
    var percentagDetractors = detractors / indicators.length * 100;

    return Math.round(percentagePromoters - percentagDetractors);
}

module.exports.calculateIndex = calculateIndex;