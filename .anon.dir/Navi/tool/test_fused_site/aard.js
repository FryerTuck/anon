"use strict";

// requires(['/Navi/tool/test_fused_site/aard.css']);


extend(Anon.Navi.tool)
({
    test_fused_site:function(tab, panl)
    {
        // Anon.Navi.vars.RECEIVER=cookie.select(`RECEIVER`); cookie.update(`RECEIVER`,`anon`);
        cookie.create(`ANONFUSETEST`,`yes`);
        select('#NaviTabber').listen('close',function()
        {
            // cookie.update(`RECEIVER`,Anon.Navi.vars.RECEIVER);
            cookie.delete(`ANONFUSETEST`);
        });

        panl=tab.body.select(`.NaviViewPanl`)[0];
        panl.insert({panl:`.posAbs`, $:
        [
            {iframe:`.spanFull`, src:HOSTPURL}
        ]});
    },
});
