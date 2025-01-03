import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, Touchable, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export default function NFCReader() {
  const [hasNFC, setHasNFC] = useState(null);
  const [lastTagRead, setLastTagRead] = useState(null);
  const [statusMessage, setStatusMessage] = useState(''); // New state for status message
  const [value, setValue] = useState(''); // New state for value
  useEffect(() => {
    checkNFC();
  }, []);

  const checkNFC = async () => {
    const supported = await NfcManager.isSupported();
    setHasNFC(supported);
    if (supported) {
      await NfcManager.start();
    }
  };

  const handleReadNFC = async () => {
    setStatusMessage('Bring the tag near...');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;
        const text = Ndef.text.decodePayload(payload);
        setValue(JSON.parse(text));
        console.log(value.patientname)
        setLastTagRead(text);
        setStatusMessage('Tag read successfully!');
      } else {
        setStatusMessage('No NDEF message found');
      }
    } catch (error) {
      console.warn('Error reading NFC:', error);
      setStatusMessage('Failed to read the tag. Try again.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (hasNFC === null) {
    return <Text>Checking NFC capability...</Text>;
  }

  if (!hasNFC) {
    return <Text>This device doesn't support NFC</Text>;
  }

  return (
    <View style={stuff.container}>
      <TouchableOpacity onPress={handleReadNFC} style={stuff.btn}>
        <Text style={stuff.btnText}>Press</Text>
      </TouchableOpacity>
      {statusMessage && (
        <Text style={{ marginTop: 10 }}>{statusMessage}</Text>
      )}
      {lastTagRead && (
        <View style={{ marginTop: 20 }}>
          
          <Text>Patient Name: {value.patientname}</Text>
          <Text>Medication Name: {value.medicine}</Text>
          <Text>Dosage: {value.dose}</Text>
          <Text>Form: {value.form}</Text>
          <Text>Manufacturer: {value.manufacturer}</Text>
          <Text>Quantity: {value.quantity}</Text>
          <Text>Taken or not: {value.taken}</Text>
          {value.dangerousorcontrolledsubstance === true ? <Text> This is a dangerous or controlled substance</Text> : <Text> This is not a dangerous or controlled substance</Text>}
          <Text> {value.dangerousorcontrolledsubstance}</Text>
          <Text> {value.specialinstructions}</Text>

        </View>
      )}
    </View>
  );
}
const stuff = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor:'#24A0ED',
    height: 50,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  }
});
