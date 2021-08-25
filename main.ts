/**
 * Controls the Adafruit 14-segment alphnumeric led display
 */
//% color="#ff7f50" icon="\uf06e" block="Alpha LED"
namespace alpha_led {
    let DEFAULT_ADDRESS = 0x70;
    let HT16K33_BLINK_CMD = 0x80
    let HT16K33_BLINK_DISPLAYON = 0x01
    let HT16K33_BLINK_OFF = 0x00
    let HT16K33_BLINK_2HZ = 0x02
    let HT16K33_BLINK_1HZ = 0x04
    let HT16K33_BLINK_HALFHZ = 0x06
    let HT16K33_SYSTEM_SETUP = 0x20
    let HT16K33_OSCILLATOR = 0x01
    let HT16K33_CMD_BRIGHTNESS = 0xE0

    let usedi2cAddress: number = DEFAULT_ADDRESS;

    let buffer = pins.createBuffer(17);

    let chars: { [key: string]: number } = { ' ': 0, '!': 6, '"': 544, '#': 4814, '$': 4845, '%': 3108, '&': 9053, "'": 1024, '(': 9216, ')': 2304, '*': 16320, '+': 4800, ',': 2048, '-': 192, '.': 0, '/': 3072, '0': 3135, '1': 6, '2': 219, '3': 143, '4': 230, '5': 8297, '6': 253, '7': 7, '8': 255, '9': 239, ':': 4608, ';': 2560, '<': 9216, '=': 200, '>': 2304, '?': 4227, '@': 699, 'A': 247, 'B': 4751, 'C': 57, 'D': 4623, 'E': 249, 'F': 113, 'G': 189, 'H': 246, 'I': 4608, 'J': 30, 'K': 9328, 'L': 56, 'M': 1334, 'N': 8502, 'O': 63, 'P': 243, 'Q': 8255, 'R': 8435, 'S': 237, 'T': 4609, 'U': 62, 'V': 3120, 'W': 10294, 'X': 11520, 'Y': 5376, 'Z': 3081, '[': 57, '\\': 8448, ']': 15, '^': 3075, '_': 8, '`': 256, 'a': 4184, 'b': 8312, 'c': 216, 'd': 2190, 'e': 2136, 'f': 113, 'g': 1166, 'h': 4208, 'i': 4096, 'j': 14, 'k': 13824, 'l': 48, 'm': 4308, 'n': 4176, 'o': 220, 'p': 368, 'q': 1158, 'r': 80, 's': 8328, 't': 120, 'u': 28, 'v': 8196, 'w': 10260, 'x': 10432, 'y': 8204, 'z': 2120, '{': 2377, '|': 4608, '}': 9353, '~': 1312 };


    /**
     * Segment LED Display
     */
    //% blockId=set_i2c_address
    //% block="set i2c address %i2cAddress"
    export function set_i2c_address(i2cAddress: number): void {
        usedi2cAddress = i2cAddress
    }

    //% blockId=initialise_alpha_led
    //% block="initialise alpha led"
    export function initialise_alpha_led(): void {

        // Init
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_SYSTEM_SETUP | HT16K33_OSCILLATOR,
            NumberFormat.UInt8LE,
            false
        )
        // Blink rate
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_BLINK_CMD | 1,
            NumberFormat.UInt8LE,
            false
        )
        // Brightness
        pins.i2cWriteNumber(
            usedi2cAddress,
            HT16K33_CMD_BRIGHTNESS | 15,
            NumberFormat.UInt8LE,
            false
        )
    }

    /**
     * AWrite raw bits to turn on individual segments
     */
    //% blockId=write_raw
    //% block="write raw %bitmask at %position"
    //% position.min=0 position.max=3
    function write_raw(bitmask: number, position: number): void {
        buffer[1 + position * 2] = bitmask & 0xff
        buffer[1 + position * 2 + 1] = (bitmask >> 8) & 0xff
    }

    //% blockId=update_display
    //% block="update display"
    export function update_display(): void {
        pins.i2cWriteBuffer(usedi2cAddress, buffer, false)
    }

    //% blockId=clear_display
    //% block="clear display"
    export function clear_display(): void {
        for (let index = 0; index <= 16; index++) {
            buffer[index] = 0
        }
    }

    //% blockId=set_character
    //% block="set character %character at %position"
    //% position.min=0 position.max=3
    export function set_character(character: string, position: number): void {
        write_raw(chars[character], position)
    }

    //% blockId=set_string
    //% block="set string %characters"
    export function set_string(character: string): void {
        write_raw(chars[character.charAt(0)], 0)
        write_raw(chars[character.charAt(1)], 1)
        write_raw(chars[character.charAt(2)], 2)
        write_raw(chars[character.charAt(3)], 3)
        pins.i2cWriteBuffer(usedi2cAddress, buffer, false)
    }
}
