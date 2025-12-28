/**
 * Required controller object for Mixxx.
 *
 * Connected by the functionprefix attribute in the midi.xml file.
 *
 * @see https://github.com/mixxxdj/mixxx/wiki/Midi-Scripting#script-file-header
 */
var VCI400 = {};

const NO_TIMER = 0;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CONTINUOUS_CONTROL    = 0xB0;
const ENCODER_LEFT_TURN = 0X7F;
const ENCODER_BALANCE = 0X40;
const ENCODER_RIGHT_TURN = 0X01;

const LED_ON = 0x4A;
const LED_OFF = 0x4B;

const VALUE_ON = 0X7F;
const VALUE_OFF = 0X00;

// midiChannels
// 1 for crossfader + track select + left deck select
// 2 for right track select + right deck Select
// 3 left encoder push
// 4 right encoder push
// 5 for left loop/jump/size section + pad mode buttons + transport control + vinyl + jog + pitch
// 6 for right loop/jump/size section + pad mode buttons + transport control + vinyl + jog + pitch
// 7 left encoder push + load
// 8 right encoder
// 11 left encoder push
// 12 right encoder
// 15 left encoder push
// 16 right encoder
// 13 left filter section
// 14 right filter section
// 15 master / library / main controls / cue mixxx / cf curve

// Deck A: ch3
// Deck B: ch4
// Deck C: ch5
// Deck D: ch6

// Deck A Pads: ch 1,2,3
// Deck B Pads: ch 4,5,6
// Deck C Pads: ch 7,8,9
// Deck D Pads: ch 10,11,12

// Load buttons: ch 7,8,9
// Deck A Encoder Push: 1,5,9,13
// Deck B Encoder Push: 2,6,10,14
// Deck C Encoder Push: 3,7,11,15
// Deck D Encoder Push: 4,8,12,16

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*      Central object that describes the controller hardware       *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

VCI400.midiMapBase = function () {
    this.Element = function (midiChannel, controlNumber) {
        let midiIncrement = midiChannel - 1;
        this.controlNumber = controlNumber;
        this.noteOn = NOTE_ON + midiIncrement;
        this.noteOff = NOTE_OFF + midiIncrement;
        this.continuesControl = CONTINUOUS_CONTROL + midiIncrement;
    };
};

VCI400.midiMapGlobal = function () {
    this.prototype = VCI400.midiMapBase;
    this.prototype.call(this);
    const MIDI_CHANNEL = 15;

    this.input = {
        'master': new this.Element(MIDI_CHANNEL, 0x2B),
        'centerPad1': new this.Element(MIDI_CHANNEL, 0x6B),
        'centerPad2': new this.Element(MIDI_CHANNEL, 0x6C),
        'centerPad3': new this.Element(MIDI_CHANNEL, 0x6D),
        'centerPad4': new this.Element(MIDI_CHANNEL, 0x6E),
        'browseTurn': new this.Element(MIDI_CHANNEL, 0x28),
        'browseClick': new this.Element(12, 0x71),
        'crossFader': new this.Element(1, 0x14),
    };
    this.output = {

    };
};

VCI400.midiMapDecks = function (deck) {
    this.prototype = VCI400.midiMapBase;
    this.prototype.call(this);
    function getMidiChannelMapping(deck) {
        this.deckMapping = {
            'A': {deck: 3, pads: 1, encoderPush: 1},
            'B': {deck: 4, pads: 4, encoderPush: 2},
            'C': {deck: 5, pads: 7, encoderPush: 3},
            'D': {deck: 6, pads: 10, encoderPush: 4},
        }
        return this.deckMapping[deck];
    }
    const MIDI_CHANNEL = getMidiChannelMapping(deck);

    this.input = {
        'trim': new this.Element(MIDI_CHANNEL.deck, 0x0C),
        'eqHi': new this.Element(MIDI_CHANNEL.deck, 0x0D),
        'eqMid': new this.Element(MIDI_CHANNEL.deck, 0x0E),
        'eqLow': new this.Element(MIDI_CHANNEL.deck, 0x0F),
        'sync': new this.Element(MIDI_CHANNEL.deck, 0x01),
        'load': new this.Element(MIDI_CHANNEL.deck, 0x02),
        'filter': new this.Element(MIDI_CHANNEL.deck, 0x10),
        'fxAssignLeft': new this.Element(MIDI_CHANNEL.deck, 0x03),
        'fxAssignRight': new this.Element(MIDI_CHANNEL.deck, 0x04),
        'pfl': new this.Element(MIDI_CHANNEL.deck, 0x05),
        'faderMSB': new this.Element(MIDI_CHANNEL.deck, 0x11),
        'faderLSB': new this.Element(MIDI_CHANNEL.deck, 0x31),
        'encoderLeft': new this.Element(MIDI_CHANNEL.deck, 0X05),
        'encoderLeftPush': new this.Element(MIDI_CHANNEL.encoderPush, 0X11),
        'shift': new this.Element(MIDI_CHANNEL.deck, 0x0F),
        'encoderRight': new this.Element(MIDI_CHANNEL.deck, 0X06),
        'encoderRightPush': new this.Element(MIDI_CHANNEL.encoderPush, 0X14),
        // Main Pad first section.
        'mainPadI1': new this.Element(MIDI_CHANNEL.pads, 0x29),
        'mainPadI2': new this.Element(MIDI_CHANNEL.pads, 0x2D),
        'mainPadI3': new this.Element(MIDI_CHANNEL.pads, 0x31),
        'mainPadI4': new this.Element(MIDI_CHANNEL.pads, 0x35),
        'mainPadI5': new this.Element(MIDI_CHANNEL.pads, 0x39),
        'mainPadI6': new this.Element(MIDI_CHANNEL.pads, 0x3D),
        'mainPadI7': new this.Element(MIDI_CHANNEL.pads, 0x41),
        'mainPadI8': new this.Element(MIDI_CHANNEL.pads, 0x45),
        // Main Pad second section.
        'mainPadII1': new this.Element(MIDI_CHANNEL.pads, 0x2A),
        'mainPadII2': new this.Element(MIDI_CHANNEL.pads, 0x2E),
        'mainPadII3': new this.Element(MIDI_CHANNEL.pads, 0x32),
        'mainPadII4': new this.Element(MIDI_CHANNEL.pads, 0x36),
        'mainPadII5': new this.Element(MIDI_CHANNEL.pads, 0x3A),
        'mainPadII6': new this.Element(MIDI_CHANNEL.pads, 0x3E),
        'mainPadII7': new this.Element(MIDI_CHANNEL.pads, 0x42),
        'mainPadII8': new this.Element(MIDI_CHANNEL.pads, 0x46),
        // Main Pad third section.
        'mainPadIII1': new this.Element(MIDI_CHANNEL.pads, 0x2B),
        'mainPadIII2': new this.Element(MIDI_CHANNEL.pads, 0x2F),
        'mainPadIII3': new this.Element(MIDI_CHANNEL.pads, 0x33),
        'mainPadIII4': new this.Element(MIDI_CHANNEL.pads, 0x37),
        'mainPadIII5': new this.Element(MIDI_CHANNEL.pads, 0x3B),
        'mainPadIII6': new this.Element(MIDI_CHANNEL.pads, 0x3F),
        'mainPadIII7': new this.Element(MIDI_CHANNEL.pads, 0x43),
        'mainPadIII8': new this.Element(MIDI_CHANNEL.pads, 0x47),
        // Main Pad fourth section.
        'mainPadIV1': new this.Element(MIDI_CHANNEL.pads, 0x2C),
        'mainPadIV2': new this.Element(MIDI_CHANNEL.pads, 0x30),
        'mainPadIV3': new this.Element(MIDI_CHANNEL.pads, 0x34),
        'mainPadIV4': new this.Element(MIDI_CHANNEL.pads, 0x38),
        'mainPadIV5': new this.Element(MIDI_CHANNEL.pads, 0x3C),
        'mainPadIV6': new this.Element(MIDI_CHANNEL.pads, 0x40),
        'mainPadIV7': new this.Element(MIDI_CHANNEL.pads, 0x44),
        'mainPadIV8': new this.Element(MIDI_CHANNEL.pads, 0x48),
        'pitchMSB': new this.Element(MIDI_CHANNEL.deck, 0x12),
        'pitchLSB': new this.Element(MIDI_CHANNEL.deck, 0x32),
        'jogWheel': new this.Element(MIDI_CHANNEL.deck, 0x13),
        'jogScratch': new this.Element(MIDI_CHANNEL.deck, 0X27),
        'jogTouch': new this.Element(MIDI_CHANNEL.deck, 0X27),
        'cue': new this.Element(MIDI_CHANNEL.deck, 0x19),
        'play': new this.Element(MIDI_CHANNEL.deck, 0x1A),
        // Track Pad mode left
        'transport1': new this.Element(MIDI_CHANNEL.deck, 0X1B),
        'transport2': new this.Element(MIDI_CHANNEL.deck, 0X1C),
        'transport3': new this.Element(MIDI_CHANNEL.deck, 0X1D),
        'transport4': new this.Element(MIDI_CHANNEL.deck, 0X1E),
        // Track Pad mode center
        'transport5': new this.Element(MIDI_CHANNEL.deck, 0X1F),
        'transport6': new this.Element(MIDI_CHANNEL.deck, 0X20),
        'transport7': new this.Element(MIDI_CHANNEL.deck, 0X21),
        'transport8': new this.Element(MIDI_CHANNEL.deck, 0X22),
        // Track Pad mode right
        'transport9': new this.Element(MIDI_CHANNEL.deck, 0X23),
        'transport10': new this.Element(MIDI_CHANNEL.deck, 0X24),
        'transport11': new this.Element(MIDI_CHANNEL.deck, 0X25),
        'transport12': new this.Element(MIDI_CHANNEL.deck, 0X26),
    };
    this.output = {
        // Only define outputs that are not covered by input definitions.
    };

    this.getGroupNumber = function () {
        return engine.getSetting("channel" + deck)
    };
}

VCI400.midiMapFX = function (fxSection) {
    this.prototype = VCI400.midiMapBase;
    this.prototype.call(this);

    function getMidiChannelMapping(fxSection) {
        this.deckMapping = {
            'left': 13,
            'right': 14,
        }
        return this.deckMapping[fxSection];
    }
    let midi_channel = getMidiChannelMapping(fxSection);

    this.input = {
        'fxControl1': new this.Element(midi_channel, 0x01),
        'fxControl2': new this.Element(midi_channel, 0x02),
        'fxControl3': new this.Element(midi_channel, 0x03),
        'fxControl4': new this.Element(midi_channel, 0x04),
        'fxSelect1': new this.Element(midi_channel, 0x08),
        'fxSelect2': new this.Element(midi_channel, 0x09),
    };
    this.output = {

    };

    this.getGroupNumber = function () {
        return engine.getSetting(fxSection + "FX")
    };
}

VCI400.factory = {
    getMidiMap: function(type, instance){
        if (typeof(this.midiMapStorage) === 'undefined') {
            this.midiMapStorage = [];
        }
        if (typeof(instance) !== 'undefined') {
            return this.getMidiMapForInstance(type, instance);
        }
        if (typeof(this.midiMapStorage[type]) === 'undefined') {
            this.midiMapStorage[type] = new VCI400[type];
        }
        return this.midiMapStorage[type];
    },
    getMidiMapForInstance: function (type, instance) {
        if (typeof(this.midiMapStorage[type]) === 'undefined') {
            this.midiMapStorage[type] = [];
        }
        if (typeof(this.midiMapStorage[type][instance]) === 'undefined') {
            this.midiMapStorage[type][instance] = new VCI400[type](instance);
        }
        return this.midiMapStorage[type][instance];
    },
}

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*                Required  Mixxx javascript methods                *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

VCI400.init = function(){
    this.shiftCollection = {
        C: new VCI400.Shift(this.factory.getMidiMap('midiMapDecks', 'C')),
        A: new VCI400.Shift(this.factory.getMidiMap('midiMapDecks', 'A')),
        B: new VCI400.Shift(this.factory.getMidiMap('midiMapDecks', 'B')),
        D: new VCI400.Shift(this.factory.getMidiMap('midiMapDecks', 'D')),
    };

    // No need for separate shift functionality per deck.
    // So we register all components to all shift buttons to make sure that shift works always regardless of the deck.
    this.registerComponentToShift = function (component) {
        Object.keys(this.shiftCollection).forEach(function(key){
            this.shiftCollection[key].button.registerComponent(component)
        }.bind(this));
    };

    this.master = new VCI400.Master(this.factory.getMidiMap('midiMapGlobal'));
    this.library = new VCI400.Library(this.factory.getMidiMap('midiMapGlobal'));

    this.deckContainer = new components.ComponentContainer();
    this.deckContainer.C = new VCI400.Deck(this.factory.getMidiMap('midiMapDecks', 'C'));
    this.deckContainer.A = new VCI400.Deck(this.factory.getMidiMap('midiMapDecks', 'A'));
    this.deckContainer.B = new VCI400.Deck(this.factory.getMidiMap('midiMapDecks', 'B'));
    this.deckContainer.D = new VCI400.Deck(this.factory.getMidiMap('midiMapDecks', 'D'));

    this.channelContainer = new components.ComponentContainer();
    this.channelContainer.C = new VCI400.Channel(this.factory.getMidiMap('midiMapDecks', 'C'));
    this.channelContainer.A = new VCI400.Channel(this.factory.getMidiMap('midiMapDecks', 'A'));
    this.channelContainer.B = new VCI400.Channel(this.factory.getMidiMap('midiMapDecks', 'B'));
    this.channelContainer.D = new VCI400.Channel(this.factory.getMidiMap('midiMapDecks', 'D'));

    this.fxContainer = new components.ComponentContainer()
    this.fxContainer.left = new VCI400.FX(this.factory.getMidiMap('midiMapFX', 'left'));
    this.fxContainer.right = new VCI400.FX(this.factory.getMidiMap('midiMapFX', 'right'));

    this.registerComponentToShift(this.library);
    this.registerComponentToShift(this.deckContainer);
    this.registerComponentToShift(this.channelContainer);
    this.registerComponentToShift(this.fxContainer);

};

VCI400.shutdown = function () {
    this.library.shutdown();
    this.deckContainer.shutdown();
    this.channelContainer.shutdown();
    this.fxContainer.shutdown();
};

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*                        Global Components                         *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

VCI400.Shift = function(midiMap) {
    const INPUT = midiMap.input;

    this.button = new VCI400.ShiftButton({
        midiIn: [INPUT.shift.noteOn, INPUT.shift.controlNumber],
    });

    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = "[Global]";
        }
    });

};
VCI400.Shift.prototype = new components.ComponentContainer()

VCI400.Library = function(midiMap) {
    const INPUT = midiMap.input;

    this.focusBackward = new components.Button({
        midiIn: [INPUT.centerPad3.noteOn, INPUT.centerPad3.controlNumber],
        inKey: 'MoveFocusBackward',
    });

    this.focusForward = new components.Button({
        midiIn: [INPUT.centerPad4.noteOn, INPUT.centerPad4.controlNumber],
        inKey: 'MoveFocusForward',
    });

    this.browseTurn = new components.Encoder({
        midiIn: [INPUT.browseTurn.continuesControl, INPUT.browseTurn.controlNumber],
        input: function (channel, control, value) {
            let balanceResult = ENCODER_BALANCE - value;
            let param = 1
            if (balanceResult < 0) {
                param = -1
            }
            this.inSetParameter(param);
        },
        unshift: function() {
            this.inKey = "MoveVertical";
        },
        shift: function() {
            this.inKey = "MoveHorizontal";
        }
    });

    this.browseClick = new components.Button({
        midiIn: [INPUT.browseClick.noteOn, INPUT.browseClick.controlNumber],
        unshift: function() {
            this.inKey = "GoToItem";
        },
        shift: function() {
            this.inKey = "sort_focused_column";
        },
    });

    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = "[Library]";
        }
    });

};
VCI400.Library.prototype = new components.ComponentContainer()

VCI400.Master = function(midiMap) {
    const INPUT = midiMap.input;

    this.masterGain = new components.Pot({
        midiIn: [INPUT.master.continuesControl, INPUT.master.controlNumber],
        inKey: `gain`
    });

    this.crossFader = new components.Pot({
        midiIn: [INPUT.crossFader.continuesControl, INPUT.crossFader.controlNumber],
        inKey: 'crossfader',
    });

    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = "[Master]";
        }
    });

};
VCI400.Master.prototype = new components.ComponentContainer()

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*                         Deck Components                          *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

VCI400.Deck = function (midiMap) {
    const GROUP_NUMBER = midiMap.getGroupNumber();
    components.Deck.call(this, GROUP_NUMBER);
    const INPUT = midiMap.input;

    this.beatjumpSize = new components.Encoder({
        midiIn: [INPUT.encoderLeft.continuesControl, INPUT.encoderLeft.controlNumber],
        input: function (channel, control, value) {
            let currentValue = this.inGetParameter();
            let newValue = currentValue * 2;
            if (ENCODER_BALANCE - value < 0) {
                newValue = currentValue / 2;
            }
            this.inSetParameter(newValue);
        },
        inKey: "beatjump_size",
    });

    this.beatjumpSizePush = new components.Button({
        midiIn: [INPUT.encoderLeftPush.noteOn, INPUT.encoderLeftPush.controlNumber],
        unshift: function() {
            this.inKey = "beatjump_forward";
        },
        shift: function() {
            this.inKey = "beatjump_backward";
        },
    });

    this.beatloopSize = new components.Encoder({
        midiIn: [INPUT.encoderRight.continuesControl, INPUT.encoderRight.controlNumber],
        input: function (channel, control, value) {
            let currentValue = this.inGetParameter();
            let newValue = currentValue * 2;
            if (ENCODER_BALANCE - value < 0) {
                newValue = currentValue / 2;
            }
            this.inSetParameter(newValue);
        },
        inKey: "beatloop_size",
    });

    this.beatloopSizePush = new components.Button({
        midiIn: [INPUT.encoderRightPush.noteOn, INPUT.encoderRightPush.controlNumber],
        unshift: function() {
            this.inKey = "beatloop_activate";
        },
        shift: function() {
            this.inKey = "reloop_toggle";
        },
    });

    this.pitchFader = new components.Pot({
        midiIn: {'msb': [INPUT.pitchMSB.continuesControl, INPUT.pitchMSB.controlNumber], 'lsb': [INPUT.pitchLSB.continuesControl, INPUT.pitchLSB.controlNumber]},
        inKey: 'rate',
    });

    // Main Pad first section mapped to hotcues:
    for (let i = 1; i <= 8; i++) {
        let input = INPUT["mainPadI" + i];
        this['hotCue' + i] = new components.HotcueButton({
            midiIn: [[input.noteOn, input.controlNumber], [input.noteOff, input.controlNumber]],
            midiOut: [input.noteOn, input.controlNumber],
            number: i,
        });
    }

    // Main Pad second section mapped to loops:
    let loopSizeList = [0.125, 0.25, 0.5, 1, 2, 4, 8, 16];
    for (let i = 1; i <= 8; i++) {
        let input = INPUT["mainPadII" + i];
        let loopSize = loopSizeList[i-1];
        this['loop' + i] = new components.Button({
            midiIn: [[input.noteOn, input.controlNumber], [input.noteOff, input.controlNumber]],
            midiOut: [input.noteOn, input.controlNumber],
            outKey: "beatloop_" + loopSize + "_enabled",
            unshift: function() {
                this.inKey = "beatloop_" + loopSize + "_activate";
            },
            shift: function() {
                this.inKey = "beatloop_" + loopSize + "_toggle";
            },
        });
    }

    // Main Pad third section mapped to beatjump:
    let jumpSizeList = [0.5, 1, 2, 4, 8, 16, 32, 64];
    for (let i = 1; i <= 8; i++) {
        let input = INPUT["mainPadIII" + i];
        let jumpSize = jumpSizeList[i-1];
        this['beatJump' + i] = new components.Button({
            midiIn: [[input.noteOn, input.controlNumber], [input.noteOff, input.controlNumber]],
            unshift: function() {
                this.inKey = "beatjump_" + jumpSize + "_forward";
            },
            shift: function() {
                this.inKey = "beatjump_" + jumpSize + "_backward";
            },

        });
    }

    // Main Pad last section mapped to track start and end hotcues:
    this['introStart'] = new components.Button({
        midiIn: [[INPUT.mainPadIV1.noteOn, INPUT.mainPadIV1.controlNumber], [INPUT.mainPadIV1.noteOff, INPUT.mainPadIV1.controlNumber]],
        midiOut: [INPUT.mainPadIV1.noteOn, INPUT.mainPadIV1.controlNumber],
        outKey: "intro_start_enabled",
        unshift: function() {
            this.inKey = "intro_start_activate";
        },
        shift: function() {
            this.inKey = "intro_start_clear";
        },
    });

    this['introEnd'] = new components.Button({
        midiIn: [[INPUT.mainPadIV2.noteOn, INPUT.mainPadIV2.controlNumber], [INPUT.mainPadIV2.noteOff, INPUT.mainPadIV2.controlNumber]],
        midiOut: [INPUT.mainPadIV2.noteOn, INPUT.mainPadIV2.controlNumber],
        outKey: "intro_end_enabled",
        unshift: function() {
            this.inKey = "intro_end_activate";
        },
        shift: function() {
            this.inKey = "intro_end_clear";
        },
    });

    // Extra hotcue buttons on the bottom row of the last pad section:
    for (let i = 8; i <= 12; i++) {
        let input = INPUT["mainPadIV" + (i-4)];
        this['hotCue' + i] = new components.HotcueButton({
            midiIn: [[input.noteOn, input.controlNumber], [input.noteOff, input.controlNumber]],
            midiOut: [input.noteOn, input.controlNumber],
            number: i,
        });
    }

    this['outroStart'] = new components.Button({
        midiIn: [[INPUT.mainPadIV3.noteOn, INPUT.mainPadIV3.controlNumber], [INPUT.mainPadIV3.noteOff, INPUT.mainPadIV3.controlNumber]],
        midiOut: [INPUT.mainPadIV3.noteOn, INPUT.mainPadIV3.controlNumber],
        outKey: "outro_start_enabled",
        unshift: function() {
            this.inKey = "outro_start_activate";
        },
        shift: function() {
            this.inKey = "outro_start_clear";
        },
    });

    this['outroEnd'] = new components.Button({
        midiIn: [[INPUT.mainPadIV4.noteOn, INPUT.mainPadIV4.controlNumber], [INPUT.mainPadIV4.noteOff, INPUT.mainPadIV4.controlNumber]],
        midiOut: [INPUT.mainPadIV4.noteOn, INPUT.mainPadIV4.controlNumber],
        outKey: "outro_end_enabled",
        unshift: function() {
            this.inKey = "outro_end_activate";
        },
        shift: function() {
            this.inKey = "outro_end_clear";
        },
    });


    this.jogWheel =     this.jogWheel = new components.JogWheelBasic({
        deck: GROUP_NUMBER,
        wheelResolution: 2600,
        alpha: 1/8,
        group: "[Channel" + GROUP_NUMBER + "]",
        midiIn: {'wheel': [INPUT.jogWheel.continuesControl, INPUT.jogWheel.controlNumber], 'touch': [[INPUT.jogScratch.noteOn, INPUT.jogScratch.controlNumber], [INPUT.jogScratch.noteOff, INPUT.jogScratch.controlNumber]]},
        inValueScale: function (value) {
            let factor = 0.2;
            if (engine.isScratching(this.deck)) {
                factor = 1;
            }
            return (value - ENCODER_BALANCE) * factor;
        },
    });

    this.playButton = new components.PlayButton({
        midiIn: [INPUT.play.noteOn, INPUT.play.controlNumber],
        // midiOut: [input.play.noteOn, input.play.controlNumber],
    });

    this.cueButton = new components.CueButton({
        midiIn: [INPUT.cue.noteOn, INPUT.cue.controlNumber],
    });

    // Track Pad mode left currently not mapped.

    // Track Pad mode center, mapped with beatjump and loop:

    this.beatJumpBackward = new components.Button({
        midiIn: [INPUT.transport5.noteOn, INPUT.transport5.controlNumber],
        midiOut: [INPUT.transport5.noteOn, INPUT.transport5.controlNumber],
        outKey: "beatjump_backward",
        unshift: function() {
            this.inKey = "beatjump_backward";
        },
        shift: function() {
            this.inKey = "beatjump_1_backward";
        },
    });

    this.beatJumpForward = new components.Button({
        midiIn: [INPUT.transport6.noteOn, INPUT.transport6.controlNumber],
        midiOut: [INPUT.transport6.noteOn, INPUT.transport6.controlNumber],
        outKey: "beatjump_forward",
        unshift: function() {
            this.inKey = "beatjump_forward";
        },
        shift: function() {
            this.inKey = "beatjump_1_forward";
        },
    });

    this.loopActivate = new components.Button({
        midiIn: [INPUT.transport7.noteOn, INPUT.transport7.controlNumber],
        midiOut: [INPUT.transport7.noteOn, INPUT.transport7.controlNumber],
        outKey: "loop_enabled",
        unshift: function() {
            this.inKey = "beatloop_activate";
        },
        shift: function() {
            this.inKey = "reloop_toggle";
        },
    });

    this.loopAnchor = new components.Button({
        midiIn: [INPUT.transport8.noteOn, INPUT.transport8.controlNumber],
        midiOut: [INPUT.transport8.noteOn, INPUT.transport8.controlNumber],
        outKey: "loop_anchor",
        unshift: function() {
            this.inKey = "loop_anchor";
            this.type = components.Button.prototype.types.toggle;
        },
        shift: function() {
            this.inKey = "beats_translate_curpos";
            this.type = components.Button.prototype.types.push;
        },
    });

    // Track Pad mode right currently not mapped.

    // Connect all components of this deck to the same control group.
    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = this.currentDeck;
        }
    });
};

VCI400.Deck.prototype = new components.Deck([]);


VCI400.Channel = function (midiMap) {
    const GROUP_NUMBER = midiMap.getGroupNumber();
    components.Deck.call(this, GROUP_NUMBER);
    const INPUT = midiMap.input;
    const OUTPUT = midiMap.output

    this.gain = new components.Pot({
        midiIn: [INPUT.trim.continuesControl, INPUT.trim.controlNumber],
        inKey: `pregain`,
    });

    this.equalizerRack = new VCI400.EqualizerRack(midiMap, 1);

    this.syncButton = new components.Button({
        midiIn: [[INPUT.sync.noteOn, INPUT.sync.controlNumber],[INPUT.sync.noteOff, INPUT.sync.controlNumber]],
        midiOut: [INPUT.sync.noteOn, INPUT.sync.controlNumber],
        outKey: "sync_enabled",
        type: components.Button.prototype.types.toggle,
        input: function(channel, control, value, status, _group) {
            if (this.inKey === 'beatsync') {
                if (this.isPress(channel, control, value, status)) {
                    if (engine.getValue(this.group, "sync_enabled") === 0) {
                        engine.setValue(this.group, this.inKey, 1);
                        this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                            engine.setValue(this.group, "sync_enabled", 1);
                            this.longPressTimer = NO_TIMER;
                        }, true);
                    } else {
                        engine.setValue(this.group, "sync_enabled", 0);
                    }
                } else {
                    if (this.longPressTimer !== NO_TIMER) {
                        engine.stopTimer(this.longPressTimer);
                        this.longPressTimer = NO_TIMER;
                    }
                }
            } else {
                components.Button.prototype.input.call(this, channel, control, value, status, _group);
            }
        },
        unshift: function() {
            this.inKey = "beatsync";

        },
        shift: function() {
            this.inKey = "quantize";
        },
    });

    this.loadTrack = new components.Button({
        midiIn: [[INPUT.load.noteOn, INPUT.load.controlNumber],[INPUT.load.noteOff, INPUT.load.controlNumber]],
        // The load button doesn't support a midi out signal. Light signal is triggered by the hardware itself.
        unshift: function() {
            this.type = components.Button.prototype.types.push;
            this.inKey = "LoadSelectedTrack";
        },
        shift: function() {
            this.type = components.Button.prototype.types.toggle;
            this.inKey = "keylock";
        },
    });

    this.filter = new components.Pot({
        midiIn: [INPUT.filter.continuesControl, INPUT.filter.controlNumber],
        inKey: `super1`,
        group: `[QuickEffectRack1_[Channel${midiMap.getGroupNumber()}]]`,
    });

    let fxButtons = ['Left', 'Right'];
    for (let i = 0; i < fxButtons.length; i++){
        let value = fxButtons[i];
        let button = "fxAssign" + value;
        let fxMidiMap = VCI400.factory.getMidiMap('midiMapFX', value.toLowerCase())
        this["fxOn" + value] = new components.Button({
            midiIn: [[INPUT[button].noteOn, INPUT[button].controlNumber],[INPUT[button].noteOff, INPUT[button].controlNumber]],
            midiOut: [INPUT[button].noteOn, INPUT[button].controlNumber],
            key: "group_[Channel" + GROUP_NUMBER + "]_enable",
            type: components.Button.prototype.types.toggle,
            group: "[EffectRack1_EffectUnit" + fxMidiMap.getGroupNumber() + "]",
        });
    }

    this.pfl = new components.Button({
        midiIn: [INPUT.pfl.noteOn, INPUT.pfl.controlNumber],
        midiOut: [INPUT.pfl.noteOn, INPUT.pfl.controlNumber],
        type: components.Button.prototype.types.toggle,
        key: 'pfl',
    });

    this.lineFader = new components.Pot({
        midiIn: {'msb': [INPUT.faderMSB.continuesControl, INPUT.faderMSB.controlNumber], 'lsb': [INPUT.faderLSB.continuesControl, INPUT.faderLSB.controlNumber]},
        inKey: 'volume'
    });

    // Connect all components of this deck to the same control group.
    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = this.currentDeck;
        }
    });
};

VCI400.Channel.prototype = new components.Deck([]);

VCI400.EqualizerRack = function (midiMap, rackNumber) {
    const INPUT = midiMap.input;

    this.eqHigh = new components.Pot({
        midiIn: [INPUT.eqHi.continuesControl, INPUT.eqHi.controlNumber],
        inKey: `parameter3`
    });

    this.eqMid = new components.Pot({
        midiIn: [INPUT.eqMid.continuesControl, INPUT.eqMid.controlNumber],
        inKey: `parameter2`
    });

    this.eqLow = new components.Pot({
        midiIn: [INPUT.eqLow.continuesControl, INPUT.eqLow.controlNumber],
        inKey: `parameter1`
    });

    // Connect all components of this deck to the same control group.
    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = `[EqualizerRack${rackNumber}_[Channel${midiMap.getGroupNumber()}]_Effect1]`;
        }
    });
};

VCI400.EqualizerRack.prototype = new components.ComponentContainer([]);

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*                          FX Components                           *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

VCI400.FX = function (midiMap) {
    const UNIT_NUMBER = midiMap.getGroupNumber();
    const STEP_SIZE = 0.05
    const INPUT = midiMap.input;

    for (let i = 1; i <= 3; i++) {
        this['param' + i]= new components.Pot({
            midiIn: [INPUT["fxControl" + i].continuesControl, INPUT["fxControl" + i].controlNumber],
            inKey: 'meta',
            group: `[EffectRack1_EffectUnit${UNIT_NUMBER}_Effect${i}]`,
        });

        this['fxToggle' + i] = new components.Button({
            midiIn: [INPUT["fxControl" + i].noteOn, INPUT["fxControl" + i].controlNumber],
            midiOut: [INPUT["fxControl" + i].noteOn, INPUT["fxControl" + i].controlNumber],
            inKey: 'enabled',
            outKey: 'enabled',
            group: `[EffectRack1_EffectUnit${UNIT_NUMBER}_Effect${i}]`,
            type: components.Button.prototype.types.toggle,
        });
    }

    this.dryWet = new components.Encoder({
        midiIn: [INPUT.fxControl4.continuesControl, INPUT.fxControl4.controlNumber],
        input: function (channel, control, value) {
            if (value === ENCODER_RIGHT_TURN) {
                this.inSetParameter(this.inGetParameter() + STEP_SIZE);
            } else if (value === ENCODER_LEFT_TURN) {
                this.inSetParameter(this.inGetParameter() - STEP_SIZE);
            }
        },
        unshift: function () {
            this.inKey = "mix";
        },
        shift: function () {
            this.inKey = "chain_preset_selector";
        },
    });

    this.fxPfl = new components.Button({
        midiIn: [[INPUT.fxControl4.noteOn, INPUT.fxControl4.controlNumber],[INPUT.fxControl4.noteOff, INPUT.fxControl4.controlNumber]],
        midiOut: [INPUT.fxControl4.noteOn, INPUT.fxControl4.controlNumber],
        key: "group_[Headphone]_enable",
        type: components.Button.prototype.types.toggle,
    });

    this.fxMaster = new components.Button({
        midiIn: [[INPUT.fxSelect1.noteOn, INPUT.fxSelect1.controlNumber],[INPUT.fxSelect1.noteOff, INPUT.fxSelect1.controlNumber]],
        midiOut: [INPUT.fxSelect1.noteOn, INPUT.fxSelect1.controlNumber],
        key: "group_[Master]_enable",
        type: components.Button.prototype.types.toggle,
        unshift: function () {
            this.inKey = "group_[Master]_enable";
            this.type = components.Button.prototype.types.toggle;
        },
        shift: function () {
            this.inKey = "next_chain_preset";
            this.type = components.Button.prototype.types.push;
        },
    });

    this.fxMode = new components.Button({
        midiIn: [[INPUT.fxSelect2.noteOn, INPUT.fxSelect2.controlNumber],[INPUT.fxSelect2.noteOff, INPUT.fxSelect2.controlNumber]],
        midiOut: [INPUT.fxSelect2.noteOn, INPUT.fxSelect2.controlNumber],
        key: 'mix_mode',
        unshift: function () {
            this.inKey = "mix_mode";
            this.type = components.Button.prototype.types.toggle;
        },
        shift: function () {
            this.inKey = "prev_chain_preset";
            this.type = components.Button.prototype.types.push;
        },
    });

    this.reconnectComponents(function (component) {
        if (component.group === undefined) {
            component.group = "[EffectRack1_EffectUnit" + UNIT_NUMBER + "]";
        }
    });
};

VCI400.FX.prototype = new components.ComponentContainer()

////////////////////////////////////////////////////////////////////////
//*                                                                  *//
//*                      Custom components                           *//
//*                                                                  *//
////////////////////////////////////////////////////////////////////////

/**
 * Shift Button
 *
 * Observer Subject where every component or collection of components
 * (component container) can subscribe to. This observer subject
 * notifies its subscribers by calling the shift and unshift methods.
 *
 * At initialisation create an object e.g.
 * MyController.shiftButton = new DnSc2000.ShiftButton();
 *
 * Then register a separate component like a button or a
 * component container with multiple components, like a deck.
 * MyController.shiftButton->registerComponentContainer(MyController.Deck)
 *
 * @param options array
 * Midi components options array, see midi-components-0.0.js
 */
VCI400.ShiftButton = (function() {

    let componentCollection = [];
    function ShiftButton(options) {
        components.Button.call(this, options);

        this.registerComponent = function (component) {
            if (component instanceof components.Component || component instanceof components.ComponentContainer) {
                componentCollection.push(component);
            }
        };

        this.input = function (channel, control, value, _status, _group) {
            midi.sendShortMsg(_status, control, value);
            this.action = 'unshift';
            if (value === VALUE_ON) {
                this.action = 'shift';
            }
            notifySubscribers(this.action, componentCollection);
        };
    }

    function notifySubscribers(action, subscribers) {
        subscribers.forEach(function (component) {
            component[action]();
        });
    }

    ShiftButton.prototype = Object.create(components.Button.prototype);
    return ShiftButton;
}());