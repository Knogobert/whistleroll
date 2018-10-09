const config = {
    sampleThreshold: 2
};
const floater = document.querySelector('#wroll-floater');
const scrollRelativity = document.querySelector('#scrollRelativity input[checked]');
let scrollHeight = window.scrollY;
let peakee = 0;

const getScroll = (peakBand) => {
    // console.log('peakBand', peakBand);
    // console.log('peakee', peakee);
    let direction = 0;

    // TODO: Take out the difference between peakee and peakBand and return a percentage of how much to scroll in either direction.
    if (peakBand > peakee) {
        console.log('up '+peakBand+' > '+peakee);
        direction = 1;
        peakee = peakBand;
    }else if (peakBand < peakee){
        console.log('down ' + peakBand + ' < ' + peakee);
        direction = -1;
        peakee = peakBand;
    }else{
        console.log('SAME '+peakBand+' == '+peakee);

    }

    return direction;
};

// Whistle detected and fired
whistlerr( (result) => {
    let theScrollDirection = null;

    // TODO: Add absolute scroll control, for real, absolute in the way that it is always compared to current body height u kno.
    if (scrollRelativity.checked === true) {
        // * Relative scroll
        theScrollDirection = getScroll(result.fft.getBandFrequency(result.fft.peakBand));
    }else{
        // * Absolute scroll
        theScrollDirection = getScroll(result.fft.getBandFrequency(result.fft.peakBand));
    }

    switch (theScrollDirection) {
        case 1:
            //floater.style.top = (Number(floater.style.top.slice(0,-1)) - 10) + '%';
            scrollHeight -= 300;
            console.log('scrollHeight', scrollHeight);
            break;
        case -1:
            //floater.style.top = (Number(floater.style.top.slice(0, -1)) + 10) + '%';
            scrollHeight += 300;
            console.log('scrollHeight', scrollHeight);
            break;

        default:
            break;
    }

    window.scroll({
        top: scrollHeight,
        behavior: "instant"
    });
    // var containerWidth = demo.container.offsetWidth;
    // var containerHeight = demo.container.offsetHeight;

    // demo.spawn((Math.random() * 10000) % containerWidth, (Math.random() * 10000) % containerHeight);
}, config);