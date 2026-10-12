import math
import wave
import struct

def generate_electric_motor_sound(filename, duration=5.0, sample_rate=44100):
    num_samples = int(duration * sample_rate)
    
    # We will create a sound that starts low and sweeps up in frequency
    # like an electric motor spinning up.
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            time = i / sample_rate
            # Frequency sweeps from 200 Hz to 1200 Hz
            freq = 200 + (1000 * (time / duration))
            
            # Add a harmonic for richness
            harmonic_freq = freq * 1.5
            
            # Generate the waveform (sine wave with a bit of distortion/sawtooth)
            value = math.sin(2.0 * math.pi * freq * time) * 0.7
            value += math.sin(2.0 * math.pi * harmonic_freq * time) * 0.3
            
            # Envelope (fade in/out)
            if time < 0.5:
                value *= (time / 0.5)
            elif time > duration - 0.5:
                value *= ((duration - time) / 0.5)
                
            # Convert to 16-bit integer
            packed_value = struct.pack('<h', int(value * 32767.0))
            wav_file.writeframes(packed_value)

generate_electric_motor_sound('c:/Users/Oreo/Desktop/New folder (2)/img/motor_sound.wav')
