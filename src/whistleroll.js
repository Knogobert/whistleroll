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
    const scrollInversion = document.querySelectorAll('#scrollInversion input[name=scrollInversion]');
    let lastPeakBand = 0;
    let relScrollHeight = window.scrollY;
    let absScrollHeight = window.scrollY;
    let scrollRelativityValue = "relative";
    let scrollBehaviorValue = "smooth";
    let scrollInversionValue = "regular";
    let scrollLength = document.querySelector('#scrollLength');
    let scrollLengthValue = scrollLength.value;
    let whistleScrollAmount = scrollLengthValue !== null ? Number(scrollLengthValue) : 300;
    let whistleRoof = 1950; // Maximum HZ to use as an absolute roof
    let whistleFloor = 600; // Minimum HZ to use as an absolute floor
    let inversionVal = 1;

    const progressBar = document.querySelector('#progress-bar');

    /*
    *   Event listeners
    */
    for(let i = 0; i < scrollRelativity.length; i++){
        scrollRelativity[i].addEventListener('change', function () {
            console.log((this.parentElement.parentElement.getAttribute('data-label') !== null ? this.parentElement.parentElement.getAttribute('data-label') : 'Changed to' ) + ": " + this.value);
            scrollRelativityValue = this.value;
            for( let j = 0; j < this.parentElement.parentElement.children.length; j++){
                this.parentElement.parentElement.children[j].classList.remove('active');
            }
            this.parentElement.classList.add('active');
        }, false);
    }

    for(let i = 0; i < scrollBehavior.length; i++){
        scrollBehavior[i].addEventListener('change', function () {
            console.log((this.parentElement.parentElement.getAttribute('data-label') !== null ? this.parentElement.parentElement.getAttribute('data-label') : 'Changed to') + ": " + this.value);
            scrollBehaviorValue = this.value;
            for (let j = 0; j < this.parentElement.parentElement.children.length; j++) {
                this.parentElement.parentElement.children[j].classList.remove('active');
            }
            this.parentElement.classList.add('active');
        }, false);
    }

    for(let i = 0; i < scrollInversion.length; i++){
        scrollInversion[i].addEventListener('change', function () {
            console.log((this.parentElement.parentElement.getAttribute('data-label') !== null ? this.parentElement.parentElement.getAttribute('data-label') : 'Changed to') + ": " + this.value);
            if (this.value === "inverted") {
                inversionVal = -1;
            }else {
                inversionVal = 1;
            }
            for (let j = 0; j < this.parentElement.parentElement.children.length; j++) {
                this.parentElement.parentElement.children[j].classList.remove('active');
            }
            this.parentElement.classList.add('active');
        }, false);
    }

    scrollLength.addEventListener('input', function (event) {
        event.preventDefault();
        console.log((event.target.getAttribute('data-label') !== null ? event.target.getAttribute('data-label') : 'Changed to') + ": " + event.target.value);
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
        if (Math.round(peakBand) === 43){
            console.log('⤃\tbackground noise detected.');
        }else if (peakBand > lastPeakBand) {
            console.log('↑\tup\t' + peakBand +'\t>\t'+lastPeakBand);
            direction = 1 * inversionVal;
            lastPeakBand = peakBand;
        }else if (peakBand < lastPeakBand){
            console.log('↓\tdown\t' + peakBand + '\t<\t' + lastPeakBand);
            direction = -1 * inversionVal;
            lastPeakBand = peakBand;
        }else{
            console.log('↔︎\tsame\t' + peakBand +'\t==\t'+lastPeakBand);
            // TODO: Keep the latest direction going on a match.
        }

        return direction;
    };

    // What to return on a absolute scroll
    const getAbsoluteScroll = (peakBand) => {
        //let absoluteHeight = document.documentElement.scrollTop || document.body.scrollTop;
        let whistleFrequency = Math.round( peakBand );
        let whistlePercentage = ( inversionVal === 1 ? (((whistleFrequency - whistleFloor) / (whistleRoof - whistleFloor)) - 1) * -1 : (((whistleFrequency - whistleFloor) / (whistleRoof - whistleFloor))) );
        let windowHeight = document.body.scrollHeight;

        if (whistleFloor < whistleFrequency && whistleFrequency < whistleRoof){
            console.log(`${whistleFloor} HZ < ${whistleFrequency} HZ < ${whistleRoof} HZ`);
            console.log(`\tAbsolute scroll at:\t${Math.round(whistlePercentage * 100)}%`);
            return whistlePercentage * windowHeight;
        }
        return null;
    };

    /*
    *   Main
    */
    whistlerr( (result) => {
        // Whistle detected and fired
        let theScrollDirection = null;
        relScrollHeight = window.scrollY;
        absScrollHeight = window.scrollY;

        if (scrollRelativityValue === "relative") {
            // * Relative scroll
            theScrollDirection = getRelativeScroll(result.fft.getBandFrequency(result.fft.peakBand));

            switch (theScrollDirection) {
                case 1:
                    //floater.style.top = (Number(floater.style.top.slice(0,-1)) - 10) + '%';
                    relScrollHeight -= whistleScrollAmount;
                    break;
                case -1:
                    //floater.style.top = (Number(floater.style.top.slice(0, -1)) + 10) + '%';
                    relScrollHeight += whistleScrollAmount;
                    break;

                default:
                    break;
            }
            console.log('\trelScrollHeight\t', relScrollHeight);

            window.scroll({
                top: relScrollHeight,
                behavior: scrollBehaviorValue
            });
        }else{
            // * Absolute scroll
            let absScrollHeight = getAbsoluteScroll(result.fft.getBandFrequency(result.fft.peakBand));

            if (Math.round(absScrollHeight) !== absScrollHeight && absScrollHeight !== null) {
                console.log('\tabsScrollHeight\t', absScrollHeight);
                window.scroll({
                    top: absScrollHeight,
                    behavior: scrollBehaviorValue
                });
            }
        }

        //updateNanobar();

        // var containerWidth = demo.container.offsetWidth;
        // var containerHeight = demo.container.offsetHeight;

        // demo.spawn((Math.random() * 10000) % containerWidth, (Math.random() * 10000) % containerHeight);

    }, config);
});