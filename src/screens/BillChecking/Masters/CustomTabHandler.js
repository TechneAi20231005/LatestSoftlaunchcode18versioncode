import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const CustomTabHeader = (
  {
    title,
    name,
    onRemove,
    amount,
    onChange,
    isLastTab,
    isRequired,
    formSubmitted,
    min,
    data,
    index,
  },
  ref
) => {
  const [editableAmount, setEditableAmount] = useState(amount);
  const [isEditing, setIsEditing] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const [flag, setFlag] = useState(0);

 const handleAmountChange = (e) => {

  const value = e.target.value;
  const sanitizedValue = value.replace(/[^\d]/g, ""); // Remove any non-digit characters
  setEditableAmount(sanitizedValue);
  onChange(sanitizedValue, name); // Pass sanitized value as the first argument and name as the second argument
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
      setIsEditing(false);
      onChange(name, editableAmount); // Pass editableAmount instead of newAmount
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange( editableAmount, name); // Pass editableAmount instead of newAmount

    if (isRequired && editableAmount.trim() === "") {
      setShowRequiredError(true);
    } else {
      setShowRequiredError(false);
    }
  };
  const [currentData, setCurrentData] = useState();
  const handleRemoveData = (e) => {
    var flag = 1;

    const currentData = data.data;
    const previousTabAmount = currentData[index - 1]?.amount || 0;
    const nextTabAmount = currentData[index + 1]?.amount || 0;
    if (
      (currentData &&
      currentData[index]?.amount <= previousTabAmount) ||
      (nextTabAmount !== 0 &&
        nextTabAmount <= currentData[index].amount)
    ) {
      setEditableAmount(null);
      onChange(null);
      alert("Amount should be greater than previous tab");
      e.preventDefault();
    }
    // if (currentData && currentData[2].amount <= currentData[1].amount) {
    //   setEditableAmount(null);
    //   onChange(null)
    //   alert("amount should not be less or equal  than first approver")
    //   e.preventDefault()
    // }
  };
  const handleClick = (e) => {
    if (e.detail === 2) {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    if (data) {
      setCurrentData(data.data);
    }
    if (amount !== null && amount !== undefined) {
      setEditableAmount(parseInt(amount));
    }
  }, [amount]);

  useEffect(() => {
    if (formSubmitted && isRequired && editableAmount.trim() === "") {
      setFlag(0);
    } else {
      setFlag(1);
    }
  }, [editableAmount, formSubmitted, isRequired]);

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(editableAmount || 0);

  const headerText = isLastTab ? "Above" : "Upto";

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (!editableAmount) {
        setIsEditing(true);
      }
    },
  }));
  return (
    <div onDoubleClick={handleClick}>
      {isEditing ? (
        <div>
          <input
            name="amount"
            type="number"
            required={isRequired ? true : false}
            placeholder="Please enter a valid amount"
            value={editableAmount ? editableAmount : ""}
            onChange={e=>handleAmountChange(e)}
            min={min}
            // onKeyDown={handleKeyDown}
            onBlur={(e) => {
              handleBlur(e);
              handleRemoveData(e);
            }}
            autoFocus
          />
          {showRequiredError && (
            <span className="error">Amount is required.</span>
          )}
        </div>
      ) : (
        <span>
          {title} ({headerText} {formattedAmount})
        </span>
      )}
    </div>
  );
};

export default forwardRef(CustomTabHeader);
