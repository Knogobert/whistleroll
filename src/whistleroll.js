document.addEventListener("DOMContentLoaded", function () {

    const config = {
        sampleThreshold: 2
    };
    const floater = document.querySelector('#wroll-floater');
    const scrollRelativity = document.querySelectorAll('#scrollRelativity input[name=scrollRelativity]');
    const scrollBehavior = document.querySelectorAll('#scrollBehavior input[name=scrollBehavior]');
    let lastPeakBand = 0;
    let scrollHeight = window.scrollY;
    let scrollRelativityValue = "relative";
    let scrollBehaviorValue = "smooth";
    let scrollLength = document.querySelector('#scrollLength');
    let scrollLengthValue = scrollLength.value;
    let whistleScrollAmount = scrollLengthValue !== null ? Number(scrollLengthValue) : 300;

    // Event listeners
    for(let i = 0; i < scrollRelativity.length; i++){
        scrollRelativity[i].addEventListener('change', function () {
            console.log("Value: " + this.value);
            scrollRelativityValue = this.value;
        }, false);
    }

    for(let i = 0; i < scrollBehavior.length; i++){
        scrollBehavior[i].addEventListener('change', function () {
            console.log("Value: " + this.value);
            scrollBehaviorValue = this.value;
        }, false);
    }

    scrollLength.addEventListener('blur', function (event) {
        event.preventDefault();
        whistleScrollAmount = Number(event.target.value);
    }, false);

    // What to return on a relative scroll
    const getRelativeScroll = (peakBand) => {
        let direction = 0;

        // TODO: Take out the difference between lastPeakBand and peakBand and return a percentage of how much to scroll in either direction.
        if (peakBand > lastPeakBand) {
            console.log('up '+peakBand+' > '+lastPeakBand);
            direction = 1;
            lastPeakBand = peakBand;
        }else if (peakBand < lastPeakBand){
            console.log('down ' + peakBand + ' < ' + lastPeakBand);
            direction = -1;
            lastPeakBand = peakBand;
        }else{
            console.log('SAME '+peakBand+' == '+lastPeakBand);
            // TODO: Keep the latest direction going on a match.
        }

        return direction;
    };

    // Whistle detected and fired
    whistlerr( (result) => {
        let theScrollDirection = null;

        // TODO: Add absolute scroll control, for real, absolute in the way that it is always compared to current body height u kno.
        if (scrollRelativityValue === "relative") {
            // * Relative scroll
            theScrollDirection = getRelativeScroll(result.fft.getBandFrequency(result.fft.peakBand));
        }else{
            // * Absolute scroll
            theScrollDirection = getRelativeScroll(result.fft.getBandFrequency(result.fft.peakBand));
        }

        switch (theScrollDirection) {
            case 1:
                //floater.style.top = (Number(floater.style.top.slice(0,-1)) - 10) + '%';
                scrollHeight -= whistleScrollAmount;
                console.log('scrollHeight', scrollHeight);
                break;
            case -1:
                //floater.style.top = (Number(floater.style.top.slice(0, -1)) + 10) + '%';
                scrollHeight += whistleScrollAmount;
                console.log('scrollHeight', scrollHeight);
                break;

            default:
                break;
        }

        window.scroll({
            top: scrollHeight,
            behavior: scrollBehaviorValue
        });
        // var containerWidth = demo.container.offsetWidth;
        // var containerHeight = demo.container.offsetHeight;

        // demo.spawn((Math.random() * 10000) % containerWidth, (Math.random() * 10000) % containerHeight);
    }, config);
});