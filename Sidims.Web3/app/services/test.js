angular.module('myApp').directive('particles', function ($window) {
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="particleJs" id="particleJs"></div>',
        link: function (scope, element, attrs, fn) {

            $window.particlesJS('particleJs', {
                particles: {
                    color: '#52a5fd',
                    shape: 'circle',
                    opacity: 1,
                    size: 5.5,
                    size_random: true,
                    nb: 20,
                    line_linked: {
                        enable_auto: true,
                        distance: 750,
                        color: '#52a5fd',
                        opacity: 0.5,
                        width: 2,
                        condensed_mode: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 600
                        }
                    },
                    anim: {
                        enable: true,
                        speed: 2.5
                    }
                },
                interactivity: {
                    enable: true,
                    mouse: {
                        distance: 250
                    },
                    detect_on: 'canvas',
                    mode: 'grab',
                    line_linked: {
                        opacity: 0.5
                    },
                    events: {
                        onclick: {
                            push_particles: {
                                enable: true,
                                nb: 4
                            }
                        }
                    }
                },
                retina_detect: true
            });

        }
    };
});