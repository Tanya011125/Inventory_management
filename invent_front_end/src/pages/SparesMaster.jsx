import React, { useState } from 'react';
import axios from 'axios';

function SparesMaster() {
  const [form, setForm] = useState({
    part_no: "",
    item_name: "",
    bin_no: "",
    rack_no: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/spares/master/", form);
    alert("Item added to Spares Master!");
    setForm({ part_no: "", item_name: "", bin_no: "", rack_no: "" });
  };

  return (
    <div>
      <h2>Spares Master - Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input name="part_no" placeholder="Item Part No" value={form.part_no} onChange={handleChange} required />
        <input name="item_name" placeholder="Item Name" value={form.item_name} onChange={handleChange} required />
        <input name="bin_no" placeholder="Bin No" value={form.bin_no} onChange={handleChange} required />
        <input name="rack_no" placeholder="Rack No" value={form.rack_no} onChange={handleChange} required />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default SparesMaster;
