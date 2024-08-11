import definePlugin, { OptionType } from "@utils/types";

// Define default sound URLs
const defaultSounds = {
    click1: "https://github.com/Domis-Vencord-Plugins/KeyboardSounds/raw/main/sounds/click1.wav",
    click2: "https://github.com/Domis-Vencord-Plugins/KeyboardSounds/raw/main/sounds/click2.wav",
    click3: "https://github.com/Domis-Vencord-Plugins/KeyboardSounds/raw/main/sounds/click3.wav",
    backspace: "https://github.com/Domis-Vencord-Plugins/KeyboardSounds/raw/main/sounds/backspace.wav"
};

// Initialize sound objects with default URLs
const createSoundObjects = (urls: typeof defaultSounds) => {
    return {
        click1: new Audio(urls.click1),
        click2: new Audio(urls.click2),
        click3: new Audio(urls.click3),
        backspace: new Audio(urls.backspace)
    };
};

let sounds = createSoundObjects(defaultSounds);

const ignoredKeys = [
    "CapsLock", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", 
    "AltLeft", "AltRight", "MetaLeft", "MetaRight", "ArrowUp", "ArrowRight", 
    "ArrowLeft", "ArrowDown", "MediaPlayPause", "MediaStop", "MediaTrackNext", 
    "MediaTrackPrevious", "MediaSelect", "MediaEject", "MediaVolumeUp", 
    "MediaVolumeDown", "AudioVolumeUp", "AudioVolumeDown"
];

const keydown = (e: KeyboardEvent) => {
    if (ignoredKeys.includes(e.code)) return;
    for (const sound of Object.values(sounds)) sound.pause();
    if (e.code === "Backspace") {
        sounds.backspace.currentTime = 0;
        sounds.backspace.play();
    } else {
        const click = sounds[`click${Math.floor(Math.random() * 3) + 1}`];
        click.currentTime = 0;
        click.play();
    }
};

export default definePlugin({
    name: "CustomKeyboardSounds",
    description: "Allows customization of keyboard sounds with user-specified URLs",
    authors: [{ name: "Your Name", id: 123456789012345678n }],

    settings: definePluginSettings({
        clickSound1: {
            description: "URL for the first click sound",
            type: OptionType.TEXT,
            default: defaultSounds.click1
        },
        clickSound2: {
            description: "URL for the second click sound",
            type: OptionType.TEXT,
            default: defaultSounds.click2
        },
        clickSound3: {
            description: "URL for the third click sound",
            type: OptionType.TEXT,
            default: defaultSounds.click3
        },
        backspaceSound: {
            description: "URL for the backspace sound",
            type: OptionType.TEXT,
            default: defaultSounds.backspace
        },
        volume: {
            description: "Volume of the keyboard sounds",
            type: OptionType.SLIDER,
            markers: [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            stickToMarkers: false,
            default: 100,
            onChange: value => {
                for (const sound of Object.values(sounds)) sound.volume = value / 100;
            }
        }
    }),

    start: () => {
        const updateSounds = () => {
            sounds = createSoundObjects({
                click1: settings.store.clickSound1,
                click2: settings.store.clickSound2,
                click3: settings.store.clickSound3,
                backspace: settings.store.backspaceSound
            });
            const volume = settings.store.volume;
            for (const sound of Object.values(sounds)) sound.volume = volume / 100;
        };

        updateSounds();
        document.addEventListener("keydown", keydown);
    },

    stop: () => document.removeEventListener("keydown", keydown)
});
