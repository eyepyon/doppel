import {
  Button,
  Container,
  Flex,
  Input,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
  useAccount,
} from "wagmi";
import { greeterAddress } from "../../utils/contractAddress";
import MedicalRecordABI from "../../contracts/ABI/MedicalRecord.json";
import { contractAddress } from "../../utils/contractAddressMedical";

function MedicalRecord() {
  const [greet, setGreet] = useState(" ");
  
  const [data, setData] = useState();
  const [checker, setChecker] = useState(false);
  const toast = useToast();
  const { isConnected } = useAccount();
  
  //const [lastUpdated, setLastUpdated] = useState("");
  //const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const { account } = useAccount();
  
  /*
  const { read: readPatient } = useContractRead({
    abi: MedicalRecord.abi,
    address: contractAddress,
    method: "patients",
  });
  */

  const { write: createPatient, status: createPatientStatus } = usePrepareContractWrite({
    abi: MedicalRecordABI.abi,
    address: contractAddress,
    method: "createPatient",
  });
  const { write: authorizeProvider, status: authorizeProviderStatus } = usePrepareContractWrite({
    abi: MedicalRecordABI.abi,
    address: contractAddress,
    method: "authorizeProvider",
  });
  const { write: revokeProvider, status: revokeProviderStatus } = usePrepareContractWrite({
    abi: MedicalRecordABI.abi,
    address: contractAddress,
    method: "revokeProvider",
  });
  const { write: updateMedicalRecord, status: updateMedicalRecordStatus } = usePrepareContractWrite({
    abi: MedicalRecordABI.abi,
    address: contractAddress,
    method: "updateMedicalRecord",
  });
  const { waitForTransaction } = useWaitForTransaction();

  const handleCreatePatient = async () => {
    await createPatient(account, [name, bloodType]);
    await waitForTransaction(createPatientStatus.txHash);
  };

  const handleAuthorizeProvider = async () => {
    await authorizeProvider(account, [providerAddress]);
    await waitForTransaction(authorizeProviderStatus.txHash);
  };

  const handleRevokeProvider = async () => {
    await revokeProvider(account, [providerAddress]);
    await waitForTransaction(revokeProviderStatus.txHash);
  };

  const handleUpdateMedicalRecord = async () => {
    await updateMedicalRecord(account, [timestamp, updatedBy]);
    await waitForTransaction(updateMedicalRecordStatus.txHash);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBloodTypeChange = (e) => {
    setBloodType(e.target.value);
  };

  const handleProviderAddressChange = (e) => {
    setProviderAddress(e.target.value);
  };

  const handleTimestampChange = (e) => {
    setTimestamp(e.target.value);
  };

  const handleUpdatedByChange = (e) => {
    setUpdatedBy(e.target.value);
  };

  const {
    data: fetchData,
    isFetched,
    isFetching,
  } = useContractRead({
    addressOrName: greeterAddress,
    contractInterface: contractAbi,
    functionName: "greet",
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    addressOrName: greeterAddress,
    contractInterface: contractAbi,
    functionName: "setGreeting",
    args: [greet],
  });

  const {
    data: postData,
    isLoading: postIsLoading,
    isSuccess: postIsSuccess,
    write,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: postData?.hash,
  });

  useEffect(() => {
    postIsSuccess && setGreet("");
    isLoading &&
      toast({
        title: "Transaction Sent",
        description: postData?.hash,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    isSuccess &&
      toast({
        title: "Transaction Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
  }, [isSuccess, isLoading, postIsSuccess, postData, toast]);

  useEffect(() => {
    setData(fetchData);
    setChecker(true);
  }, [isFetching, isFetched]);

  return (
    <>
      <Container
        mb={"5em"}
        border="1px solid #CBD5E0"
        rounded={"10px"}
        p={"2em"}
        align={"center"}
      >
        <Stack spacing={"1em"} align={"center"}>
          <Flex
            w={"60%"}
            justifyContent={"space-around"}
            mb={"1em"}
            alignItems={"center"}
          >
            <Text fontWeight={"700"}>Greetings: </Text>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Skeleton
                isLoaded={checker}
                rounded={"30px"}
                h={"20px"}
                w={"150px"}
              >
                <Text>{data}</Text>
              </Skeleton>
            </Flex>
          </Flex>

          <Input
            mx={"auto"}
            variant={"outline"}
            w={"80%"}
            placeholder="Enter Greetings"
            textAlign={"center"}
            value={greet}
            onChange={(e) => setGreet(e.target.value)}
          />
          <Button
            isLoading={postIsLoading || isLoading}
            fontWeight={"700"}
            mt={"1em"}
            onClick={() => write()}
            isDisabled={!isConnected}
          >
            Set Greetings
          </Button>
          <div>
        <label>Blood Type:</label>
        <input type="text" value={bloodType} onChange={handleBloodTypeChange} />
      </div>
      <button onClick={handleCreatePatient}>Create</button>

      <hr />

      <h2>Authorize Provider</h2>
      <div>
        <label>Patient Address:</label>
        <input type="text" value={patientAddress} onChange={handlePatientAddressChange} />
      </div>
      <div>
        <label>Provider Address:</label>
        <input type="text" value={providerAddress} onChange={handleProviderAddressChange} />
      </div>
      <button onClick={handleAuthorizeProvider}>Authorize</button>

      <hr />

      <h2>Revoke Provider</h2>
      <div>
        <label>Patient Address:</label>
        <input type="text" value={patientAddress} onChange={handlePatientAddressChange} />
      </div>
      <div>
        <label>Provider Address:</label>
        <input type="text" value={providerAddress} onChange={handleProviderAddressChange} />
      </div>
      <button onClick={handleRevokeProvider}>Revoke</button>

      <hr />

      <h2>View Medical Record</h2>
      <div>
        <label>Patient Address:</label>
        <input type="text" value={patientAddress} onChange={handlePatientAddressChange} />
      </div>
      <button onClick={handleViewMedicalRecord}>View</button>

      <div>
        <label>Name:</label>
        <span>{medicalRecord?.name}</span>
      </div>
      <div>
        <label>Blood Type:</label>
        <span>{medicalRecord?.bloodType}</span>
      </div>
      <div>
        <label>Last Updated:</label>
        <span>{medicalRecord?.lastUpdated}</span>
      </div>
      <div>
        <label>Last Updated By:</label>
        <span>{medicalRecord?.lastUpdatedBy}</span>
      </div>

      <hr />

      <h2>Update Medical Record</h2>
      <div>
        <label>Patient Address:</label>
        <input type="text" value={patientAddress} onChange={handlePatientAddressChange} />
      </div>
      <div>
        <label>Timestamp:</label>
        <input type="text" value={timestamp} onChange={handleTimestampChange} />
      </div>
      <div>
        <label>Updated By:</label>
        <input type="text" value={updatedBy} onChange={handleUpdatedByChange} />
      </div>
      <button onClick={handleUpdateMedicalRecord}>Update</button>
    
      </Stack>
      </Container>
    </>
  );
}

export default MedicalRecord;
