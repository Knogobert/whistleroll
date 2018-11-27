document.addEventListener("DOMContentLoaded", function () {

    /*
    *   Initializations
    */
    // Add a scrollindicator as a loader via nanobar.js
    const nanobar = new Nanobar({ id: "progress-bar"});

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
    let invertScroll = -1;

    const progressBar = document.querySelector('#progress-bar');

    /*
    *   Event listeners
    */
    for(let i = 0; i < scrollRelativity.length; i++){
        scrollRelativity[i].addEventListener('change', function () {
            console.log("Value: " + this.value);
            scrollRelativityValue = this.value;
            for( let j = 0; j < this.parentElement.parentElement.children.length; j++){
                this.parentElement.parentElement.children[j].classList.remove('active');
            }
            this.parentElement.classList.add('active');
        }, false);
    }

    for(let i = 0; i < scrollBehavior.length; i++){
        scrollBehavior[i].addEventListener('change', function () {
            console.log("Value: " + this.value);
            scrollBehaviorValue = this.value;
            for (let j = 0; j < this.parentElement.parentElement.children.length; j++) {
                this.parentElement.parentElement.children[j].classList.remove('active');
            }
            this.parentElement.classList.add('active');
        }, false);
    }

    scrollLength.addEventListener('blur', function (event) {
        event.preventDefault();
        whistleScrollAmount = Number(event.target.value);
    }, false);

    //document.body.addEventListener("scroll", updateprogressBar);
    document.addEventListener('scroll', function () {
        let scroll = (document.documentElement['scrollTop'] || document.body['scrollTop']) / ((document.documentElement['scrollHeight'] || document.body['scrollHeight']) - document.documentElement.clientHeight) * 100;
        progressBar.style.setProperty('--scroll', scroll + '%');
        nanobar.go(scroll);
    });


    /*
    *   Functions
    */
    // function updateNanobar() {
    //     let absoluteHeight = document.documentElement.scrollTop || document.body.scrollTop;
    //     let windowHeight = document.body.scrollHeight;
    //     nanobar.go( (absoluteHeight / windowHeight) * 100 );
    // }

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

    // What to return on a absolute scroll
    const getAbsoluteScroll = (peakBand) => {
        //let absoluteHeight = document.documentElement.scrollTop || document.body.scrollTop;
        let whistleRoof = 2000; // Maximum HZ to use as an absolute roof
        let whistleFloor = 600; // Minimum HZ to use as an absolute floor
        let whistleFrequency = Math.round( peakBand );
        let whistlePercentage = ( whistleFrequency - whistleFloor) * 1 / ( whistleRoof - whistleFloor );
        let windowHeight = document.body.scrollHeight;

        console.log(`${whistleFloor} HZ < ${whistleFrequency} HZ < ${whistleRoof} HZ`);
        console.log(`Absolute scroll at: ${Math.round(whistlePercentage * 100)}%`);
        nanobar.go(whistlePercentage * 100);
        return whistlePercentage * windowHeight;
    };

    /*
    *   Main
    */
    whistlerr( (result) => {
        // Whistle detected and fired
        let theScrollDirection = null;

        if (scrollRelativityValue === "relative") {
            // * Relative scroll
            theScrollDirection = getRelativeScroll(result.fft.getBandFrequency(result.fft.peakBand));

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
        }else{
            // * Absolute scroll
            scrollHeight = getAbsoluteScroll(result.fft.getBandFrequency(result.fft.peakBand));
            console.log('scrollHeight', scrollHeight);
        }

        //updateNanobar();

        window.scroll({
            top: scrollHeight,
            behavior: scrollBehaviorValue
        });
        // var containerWidth = demo.container.offsetWidth;
        // var containerHeight = demo.container.offsetHeight;

        // demo.spawn((Math.random() * 10000) % containerWidth, (Math.random() * 10000) % containerHeight);

    }, config);
});