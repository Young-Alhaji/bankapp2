import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import styles from "../Modules/transfer.module.css";
import { useNavigate } from "react-router";

const Transfer = () => {
  let allUsers = JSON.parse(localStorage.allOfUsers);
  let i = JSON.parse(localStorage.indexes);
  let navigate = useNavigate();
  let time = new Date().toLocaleString();
  const [cTime, setTime] = useState(time);
  useEffect(() => {
    setInterval(() => {
      setTime(time);
    }, 1000);
  });
  const [amount, setamount] = useState(parseInt(0));
  const [bankName, setbankName] = useState("");
  const [accountNumber, setaccountNumber] = useState(0);
  const [accountName, setaccountName] = useState("");
  const [pin, setpin] = useState(0);
  const [alldetails, setalldetails] = useState([]);
  const [error, seterror] = useState(false);
  const [error2, seterror2] = useState(false);
  const [insufficient, setinsufficient] = useState(false);

  useEffect(() => {
    let debit = JSON.parse(localStorage.allOfUsers)[i].fundsOut;
    if (debit) {
      setalldetails(debit);
    }
  }, []);

  const transfer = async () => {
    let allUsers = JSON.parse(localStorage.allOfUsers);
    let i = JSON.parse(localStorage.indexes);
    if (!amount || !bankName || !accountNumber || !accountName || !pin) {
      seterror(true);
      seterror2(false);
      setinsufficient(false);
    } else if (pin !== allUsers[i].pin) {
      seterror2(true);
      seterror(false);
      setinsufficient(false);
    } else if (amount > allUsers[i].balance) {
      setinsufficient(true);
      seterror2(false);
      seterror(false);
    } else {
      let newBalance = allUsers[i].balance - amount;
      allUsers[i].balance = newBalance;
      localStorage.allOfUsers = JSON.stringify(allUsers);
      let eachDetail = { amount, bankName, accountNumber, accountName, cTime };
      await setalldetails(() => {
        let localStudents = [...alldetails, eachDetail];
        allUsers[i].fundsOut = localStudents;
        localStorage.allOfUsers = JSON.stringify(allUsers);
        return localStudents;
      });
      seterror2(false);
      seterror(false);
      setinsufficient(false);
      navigate("/transfer/success");
    }
  };

  return (
    <>
      <Navbar transfercolor="text-white" />

      <center>
        <p className={styles.p}>Transfer Funds</p>
        <div>
          <div className={styles.box}>
            {" "}
            <br />
            <br />
            <input
              type="text"
              placeholder="Bank Name"
              onChange={(e) => setbankName(e.target.value)}
            />{" "}
            <br />
            <br />
            <input
              type="number"
              placeholder="Account Number"
              onChange={(e) => setaccountNumber(e.target.value)}
            />{" "}
            <br />
            <br />
            <input
              type="text"
              placeholder="Account Name"
              onChange={(e) => setaccountName(e.target.value)}
            />{" "}
            <br />
            <br />
            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => setamount(e.target.value)}
            />{" "}
            <br />
            <br />
            <input
              type="password"
              placeholder="Transfer Pin"
              onChange={(e) => setpin(e.target.value)}
            />{" "}
            <br />
            <br />
            <br />
            {error ? (
              <p className={styles.error}>Kindly Input all fields</p>
            ) : (
              ""
            )}
            {error2 ? <p className={styles.error}>Incorrect Pin</p> : ""}
            {insufficient ? (
              <p className={styles.error}>Insufficient funds</p>
            ) : (
              ""
            )}
          </div>{" "}
          <br /> <br />
          <button className={styles.button} onClick={transfer}>
            Make Transfer
          </button>
        </div>
      </center>
    </>
  );
};

export default Transfer;
