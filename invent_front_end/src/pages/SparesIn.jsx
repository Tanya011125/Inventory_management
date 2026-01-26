import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SparesIn() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qtyIn, setQtyIn] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/spares/master/")
      .then(res => setItems(res.data));
  }, []);

  const handleSelect = (e) => {
    const part = e.target.value;
    const item = items.find(i => i.part_no === part);
    setSelectedItem(item);
  };

  const submitIn = async () => {
    await axios.post("http://localhost:8000/api/spares/in/", {
      part_no: selectedItem.part_no,
      quantity_in: qtyIn
    });
    alert("Quantity updated!");
    setQtyIn("");
  };

  return (
    <div>
      <h2>Spares In</h2>

      <select onChange={handleSelect}>
        <option value="">Select Item Part No</option>
        {items.map(i => (
          <option key={i.part_no} value={i.part_no}>{i.part_no}</option>
        ))}
      </select>

      {selectedItem && (
        <>
          <p><b>Item Name:</b> {selectedItem.item_name}</p>
          <p><b>Quantity Available:</b> {selectedItem.quantity_available}</p>

          <input
            type="number"
            placeholder="Quantity In"
            value={qtyIn}
            onChange={(e) => setQtyIn(e.target.value)}
          />

          <button onClick={submitIn}>Update Stock</button>
        </>
      )}
    </div>
  );
}

export default SparesIn;
