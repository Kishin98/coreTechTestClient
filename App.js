import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import DropDownPicker from "react-native-dropdown-picker";

import { getJobDetailsDescriptions } from "./utils";

//if the server is hosted on localhost, replace the IP address with localhost
//if you are building the app on a physical device, you need the explicit IP address
const API_URL = "http://SERVER_IP_ADDRESS:3000/";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [jobClass, setJobClass] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDetail, setJobDetail] = useState("");
  const [curriculum, setCurriculum] = useState(null);
  const [codeInput, setCodeInput] = useState("");

  //the code will be randomly generated once the send code button is pressed ad sent via email. Then the codeInput will be copared to it
  //there is no timeout for simplicity reson
  //also the entropy of the random function is not great
  const [code, setCode] = useState("");

  //Form error states
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [educationError, setEducationError] = useState(false);
  const [jobClassError, setJobClassError] = useState(false);
  const [jobLocationError, setJobLocationError] = useState(false);
  const [jobDetailError, setJobDetailError] = useState(false);
  const [codeInputError, setCodeInputError] = useState(false);

  //Dropdown pickers open state
  const [educationOpen, setEducationOpen] = useState(false);
  const [jobClassOpen, setJobClassOpen] = useState(false);
  const [jobLocationOpen, setJobLocationOpen] = useState(false);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);

  //Dropdown picker open handlers START
  const onEducationOpen = (open) => {
    setJobClassOpen(false);
    setJobLocationOpen(false);
    setJobDetailOpen(false);
    setEducationOpen(open);
  };

  const onJobClassOpen = (open) => {
    setEducationOpen(false);
    setJobLocationOpen(false);
    setJobDetailOpen(false);
    setJobClassOpen(open);
  };

  const onJobLocationOpen = (open) => {
    setEducationOpen(false);
    setJobClassOpen(false);
    setJobDetailOpen(false);
    setJobLocationOpen(open);
  };

  const onJobDetailOpen = (open) => {
    setEducationOpen(false);
    setJobClassOpen(false);
    setJobLocationOpen(false);
    setJobDetailOpen(open);
  };
  //Dropdown picker open handlers END

  //Dropdown picker change handlers START
  const onEducationChange = (value) => {
    setEducation(value);
    setEducationError(false);
  };

  const onJobClassChange = (value) => {
    setJobLocation("");
    setJobClass(value);
    setJobClassError(false);
  };

  const onJobLocationChange = (value) => {
    setJobDetail("");
    setJobLocation(value);
    setJobLocationError(false);
  };

  const onJobDetailChange = (value) => {
    setJobDetail(value);
    setJobDetailError(false);
  };
  //Dropdown picker change handlers END

  const onSubmit = async () => {
    setLoading(true);
    var errorMessage = validateInput();
    if (errorMessage !== "") {
      Alert.alert("Attenzione", errorMessage);
    } else {
      const file = curriculum;
      const data = new FormData();
      data.append("firstName", firstName);
      data.append("lastName", lastName);
      data.append("email", email);
      data.append("phone", phone);
      data.append("age", age);
      data.append("education", education);
      data.append("jobClass", jobClass);
      data.append("jobLocation", jobLocation);
      data.append("jobDetail", jobDetail);
      if (curriculum !== null) {
        const uriArray = file.uri.split(".");
        const fileExtension = uriArray[uriArray.length - 1];
        const fileTypeExtended = `${file.type}/${fileExtension}`;
        data.append("curriculum", {
          uri: file.uri,
          name: file.name,
          type: fileTypeExtended,
        });
      }
      try {
        let response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        });
        if (response.status === 200) {
          Alert.alert("Congratulazioni", "Ti sei candidato con successo!");
        } else {
          Alert.alert("Qualcosa è andato storto...");
        }
      } catch (e) {
        console.log(e);
        Alert.alert("Qualcosa è andato storto...");
      }
    }
    setLoading(false);
  };

  const onReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAge("");
    setEducation("");
    setJobClass("");
    setJobLocation("");
    setJobDetail("");
    setCurriculum(null);
    setCodeInput("");
    setCode("");
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setAgeError(false);
    setEducationError(false);
    setJobClassError(false);
    setJobLocationError(false);
    setJobDetailError(false);
    setCodeInputError(false);
    setEducationOpen(false);
    setJobClassOpen(false);
    setJobLocationOpen(false);
    setJobDetailOpen(false);
  };

  //Checks if age is a number(saves it as string but will be converted)
  const onAgeChange = (text) => {
    if (/^\d*$/.test(text)) {
      setAge(text);
    }
  };
  const onPhoneChange = (text) => {
    if (/^[()+\d ]*$/.test(text)) {
      setPhone(text);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.type !== "cancel") {
      var lastThree = result.name.substr(result.name.length - 3);
      if (lastThree == "pdf" || lastThree == "doc") {
        if (result.type == "success") {
          setCurriculum(result);
        }
      } else {
        alert("Seleziona un file PDF o DOC!");
      }
    } else {
      console.log("cancelled");
      setCurriculum(null);
    }
  };

  //input validation on blurred START
  const onFirstNameBlurred = () => {
    setFirstNameError(firstName.trim() === "");
  };
  const onLastNameBlurred = () => {
    setLastNameError(lastName.trim() === "");
  };
  const onEmailBlurred = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setEmailError(!reg.test(email));
  };
  const onPhoneBlurred = () => {
    let reg = /^(([+]|00)39)?\s?((3[1-6][0-9]))\s?(\d{7})$/;
    setPhoneError(!reg.test(phone));
  };
  const onAgeBlurred = () => {
    setAgeError(age === "" || parseInt(age) > 80 || parseInt(age) < 16);
  };
  //input validation on blurred END

  //Generate and send the verification code
  //This function doesn't send a real email because a email server would be needed. So just copy the code from the console to test this fiction
  const onSendCodePressed = () => {
    let randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(randomCode);
    console.log(randomCode);
  };

  const validateInput = () => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let phoneReg = /^(([+]|00)39)?\s?((3[1-6][0-9]))\s?(\d{7})$/;
    var errorMessage = "";
    if (firstName.trim() === "") {
      setFirstNameError(true);
      errorMessage += "Il nome non è valido!\n";
    } else {
      setFirstNameError(false);
    }
    if (lastName.trim() === "") {
      setLastNameError(true);
      errorMessage += "Il cognome non è valido!\n";
    } else {
      setLastNameError(false);
    }
    if (!emailReg.test(email)) {
      setEmailError(true);
      errorMessage += "L'email non è valida!\n";
    } else {
      setEmailError(false);
    }
    if (!phoneReg.test(phone)) {
      setPhoneError(true);
      errorMessage += "Il numero di telefono non è valido!\n";
    } else {
      setPhoneError(false);
    }
    if (age === "" || parseInt(age) > 80 || parseInt(age) < 16) {
      setAgeError(true);
      errorMessage += "L'età non è valida!\n";
    } else {
      setAgeError(false);
    }
    if (education === "") {
      setEducationError(true);
      errorMessage += "Devi selezionare un livello di edicazione!\n";
    } else {
      setEducationError(false);
    }
    if (jobClass === "") {
      setJobClassError(true);
      errorMessage += "Devi selezionare un tipo di posizione lavorativa!\n";
    } else {
      setJobClassError(false);
    }
    if (jobLocation === "") {
      setJobLocationError(true);
      errorMessage += "Devi selezionare una sede di lavoro!\n";
    } else {
      setJobLocationError(false);
    }
    if (jobDetail === "") {
      setJobDetailError(true);
      errorMessage += "Devi selezionare una posizione lavorativa!\n";
    } else {
      setJobDetailError(false);
    }
    if (codeInput === "" || codeInput !== code) {
      setCodeInputError(true);
      errorMessage += "Il codice di verifica inserito è sbagliato!\n";
    } else {
      setCodeInputError(false);
    }
    return errorMessage;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Candidati!</Text>
            <Text style={{ marginBottom: 12 }}>
              I campi contrasegnati con * sono obbligatori!
            </Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
              onBlur={() => onFirstNameBlurred()}
              style={firstNameError ? styles.inputError : styles.input}
              onChangeText={setFirstName}
              value={firstName}
              placeholder="Nome"
            />
            <Text style={styles.label}>Cognome *</Text>
            <TextInput
              onBlur={() => onLastNameBlurred()}
              style={lastNameError ? styles.inputError : styles.input}
              onChangeText={setLastName}
              value={lastName}
              placeholder="Cognome"
            />
            <Text style={styles.label}>Email *</Text>
            <TextInput
              onBlur={() => onEmailBlurred()}
              style={emailError ? styles.inputError : styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
            />
            <Text style={styles.label}>Telefono *</Text>
            <TextInput
              onBlur={() => onPhoneBlurred()}
              style={phoneError ? styles.inputError : styles.input}
              onChangeText={onPhoneChange}
              value={phone}
              placeholder="Telefono"
            />

            <Text style={styles.label}>Età *</Text>
            <TextInput
              onBlur={() => onAgeBlurred()}
              style={ageError ? styles.inputError : styles.input}
              onChangeText={onAgeChange}
              value={age}
              placeholder="Età"
              keyboardType="numeric"
            />
            <DropDownPicker
              listMode="SCROLLVIEW"
              zIndex={10000}
              zIndexInverse={7000}
              style={educationError ? styles.dropdownError : styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              open={educationOpen}
              value={education}
              placeholder="Seleziona livello di edicazione*"
              items={[
                { label: "Diploma", value: "Diploma" },
                { label: "Laurea", value: "Laurea" },
              ]}
              setOpen={onEducationOpen}
              setValue={onEducationChange}
            />
            <DropDownPicker
              listMode="SCROLLVIEW"
              zIndex={9000}
              zIndexInverse={8000}
              style={jobClassError ? styles.dropdownError : styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              open={jobClassOpen}
              value={jobClass}
              placeholder="Seleziona il tipo di posizione a cui vuoi candidarti*"
              items={[
                { label: "Cuoco", value: "Cuoco" },
                { label: "Cameriere", value: "Cameriere" },
              ]}
              setOpen={onJobClassOpen}
              setValue={onJobClassChange}
            />
            {jobClass === "Cuoco" && (
              <>
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  zIndex={7000}
                  zIndexInverse={9000}
                  style={
                    jobLocationError ? styles.dropdownError : styles.dropdown
                  }
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={jobLocationOpen}
                  value={jobLocation}
                  placeholder="Seleziona la sede di lavoro*"
                  items={[
                    { label: "Milano", value: "Milano" },
                    { label: "Roma", value: "Roma" },
                    { label: "Qualsiasi", value: "Qualsiasi" },
                  ]}
                  setOpen={onJobLocationOpen}
                  setValue={onJobLocationChange}
                />
                {jobLocation !== "" && (
                  <>
                    <DropDownPicker
                      listMode="SCROLLVIEW"
                      zIndex={6000}
                      zIndexInverse={10000}
                      style={
                        jobDetailError ? styles.dropdownError : styles.dropdown
                      }
                      dropDownContainerStyle={styles.dropdownContainer}
                      open={jobDetailOpen}
                      value={jobDetail}
                      placeholder="Seleziona la posizione a cui vuoi candidarti*"
                      items={
                        jobLocation === "Roma"
                          ? [{ label: "Cuoco primi", value: "Cuoco primi" }]
                          : [
                              { label: "Cuoco primi", value: "Cuoco primi" },
                              {
                                label: "Cuoco secondi",
                                value: "Cuoco secondi",
                              },
                            ]
                      }
                      setOpen={onJobDetailOpen}
                      setValue={onJobDetailChange}
                    />
                    <Text style={styles.jobDescription}>
                      {getJobDetailsDescriptions(jobLocation, jobDetail)}
                    </Text>
                  </>
                )}
              </>
            )}
            {jobClass === "Cameriere" && (
              <>
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  zIndex={7000}
                  zIndexInverse={9000}
                  style={
                    jobLocationError ? styles.dropdownError : styles.dropdown
                  }
                  dropDownContainerStyle={styles.dropdownContainer}
                  open={jobLocationOpen}
                  value={jobLocation}
                  placeholder="Seleziona la sede di lavoro*"
                  items={[
                    { label: "Milano", value: "Milano" },
                    { label: "Genova", value: "Genova" },
                    { label: "Qualsiasi", value: "Qualsiasi" },
                  ]}
                  setOpen={onJobLocationOpen}
                  setValue={onJobLocationChange}
                />
                {jobLocation !== "" && (
                  <>
                    <DropDownPicker
                      listMode="SCROLLVIEW"
                      zIndex={6000}
                      zIndexInverse={10000}
                      style={
                        jobDetailError ? styles.dropdownError : styles.dropdown
                      }
                      dropDownContainerStyle={styles.dropdownContainer}
                      open={jobDetailOpen}
                      value={jobDetail}
                      placeholder="Seleziona la posizione a cui vuoi candidarti*"
                      items={
                        jobLocation === "Genova"
                          ? [
                              {
                                label: "Cameriere di sala",
                                value: "Cameriere di sala",
                              },
                            ]
                          : [
                              {
                                label: "Cameriere di sala",
                                value: "Cameriere di sala",
                              },
                              { label: "Maître", value: "Maître" },
                            ]
                      }
                      setOpen={onJobDetailOpen}
                      setValue={onJobDetailChange}
                    />
                    <Text style={styles.jobDescription}>
                      {getJobDetailsDescriptions(jobLocation, jobDetail)}
                    </Text>
                  </>
                )}
              </>
            )}
            <Text
              style={{ alignSelf: "flex-start", marginLeft: 12, marginTop: 12 }}
            >
              Carica il tuo cv (PDF o DOC)
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: 12,
                elevation: -2,
              }}
            >
              <Button onPress={pickDocument} title="Seleziona file" />
              <Text>{curriculum === null ? "No file" : curriculum.name}</Text>
            </View>

            <Text style={styles.label}>Codice di verifica *</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: 20,
                elevation: -2,
              }}
            >
              <TextInput
                style={codeInputError ? styles.inputError : styles.input}
                onChangeText={setCodeInput}
                value={codeInput}
                placeholder="000000"
              />
              <Button onPress={onSendCodePressed} title="Invia il codice" />
            </View>

            <View style={{ elevation: -2, marginBottom: 10 }}>
              <Button onPress={onSubmit} title="Invia" />
            </View>
            <View style={{ elevation: -2, marginBottom: 100 }}>
              <Button onPress={onReset} title="Reset" color="red" />
            </View>
            <StatusBar style="auto" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    marginVertical: 2,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    alignSelf: "stretch",
    borderRadius: 10,
  },
  inputError: {
    height: 40,
    marginVertical: 2,
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    alignSelf: "stretch",
    borderRadius: 10,
    borderColor: "red",
  },
  dropdown: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
  },
  dropdownError: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    borderColor: "red",
  },
  dropdownContainer: {
    width: 300,
    margin: 12,
    borderWidth: 1,
  },
  buttonStyle: {
    backgroundColor: "#307ecc",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307ecc",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 15,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
    padding: 20,
  },
  jobDescription: {
    paddingHorizontal: 20,
  },
});
