$(function(){
    var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    if (!mobile){
        jQuery('#example3').raindrops(
            {color:'#ddb3c2', waveLength: 700,waveHeight: 50}
        );
    }
});