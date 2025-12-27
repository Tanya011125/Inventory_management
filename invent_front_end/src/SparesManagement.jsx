import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';
import styles from './components/styles.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import React from 'react';

function apiBase() {
  return 'http://localhost:8000/api';
}

function authHeaders() {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function SparesManagement() {
  const navigate = useNavigate();

  return (
    <div className={styles.inventoryLayout}>
      <Sidebar />
      <div className={styles.inventoryMain}>
        <Header />
        <div className={styles.page}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>SPARES MANAGEMENT</div>
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => {navigate('/choice');}}>CLOSE</button>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>SPARES MASTER LIST</div>
              <div className={styles.cardDesc}>Item details with location item placed.</div>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/spares/spares-master-list">OPEN</Link>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>SPARES IN</div>
              <div className={styles.cardDesc}>Item-in details.</div>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/spares/spares-in">OPEN</Link>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>SPARES OUT</div>
              <div className={styles.cardDesc}>Item-out details.</div>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/spares/spares-out">OPEN</Link>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>VIEW ITEM</div>
              <div className={styles.cardDesc}>Complete history of all items.</div>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/spares/view-item">OPEN</Link>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>COMPLETE STOCK CHECK</div>
              <div className={styles.cardDesc}>View and Download item details.</div>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/spares/stock-check">OPEN</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function SparesMasterListPage() {
  const [partNo, setPartNo] = useState("");
  const [itemName, setItemName] = useState("");
  const [binNo, setBinNo] = useState("");
  const [rackNo, setRackNo] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const clearForm = () => {
    setPartNo("");
    setItemName("");
    setBinNo("");
    setRackNo("");
    setStatus("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const confirmSubmit = window.confirm(
      `Add new item?\n\nPart No: ${partNo}\nName: ${itemName}`
    );
    if (!confirmSubmit) return;

    try {
      const res = await fetch(`${apiBase()}/spares/master/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          part_no: partNo,
          item_name: itemName,
          bin_no: binNo,
          rack_no: rackNo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      alert("Item added to master list!");
      setStatus("Item added");
      clearForm();
    } catch (err) {
      alert(err.message);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className={styles.page}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>SPARES — MASTER LIST</div>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => navigate("/user/spares")}
            >
              CLOSE
            </button>
          </div>

          <div className={styles.card}>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.formGrid2}>
                <label className={styles.label}>
                  ITEM PART NO
                  <input
                    className={styles.control}
                    value={partNo}
                    onChange={(e) => setPartNo(e.target.value)}
                    required
                  />
                </label>

                <label className={styles.label}>
                  ITEM NAME
                  <input
                    className={styles.control}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </label>

                <label className={styles.label}>
                  BIN NO
                  <input
                    className={styles.control}
                    value={binNo}
                    onChange={(e) => setBinNo(e.target.value)}
                  />
                </label>

                <label className={styles.label}>
                  RACK NO
                  <input
                    className={styles.control}
                    value={rackNo}
                    onChange={(e) => setRackNo(e.target.value)}
                  />
                </label>
              </div>

              {status && <div>{status}</div>}

              <div className={styles.pageActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  ADD ITEM
                </button>
              </div>
            </form>
          </div>
    </div>
  );
}

function SparesInPage() {
  const [items, setItems] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [itemName, setItemName] = useState("");
  const [currentQty, setCurrentQty] = useState(0);
  const [qtyIn, setQtyIn] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadMasterList();
  }, []);

  const loadMasterList = async () => {
    try {
      const res = await fetch(`${apiBase()}/spares/master`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const clearForm = () => {
    setItemName('');
    setCurrentQty('');
    setQtyIn('');
    setSelectedPart('');
    setStatus('');
  };

  const handleSelectPart = (partNo) => {
    setSelectedPart(partNo);
    const item = items.find((i) => i.part_no === partNo);

    if (item) {
      setItemName(item.item_name);
      setCurrentQty(item.qty || 0);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const confirmSubmit = window.confirm(
      `Add quantity?\n\nPart No: ${selectedPart}\nQty In: ${qtyIn}`
    );
    if (!confirmSubmit) return;

    try {
      const res = await fetch(`${apiBase()}/spares/in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          part_no: selectedPart,
          qty_in: Number(qtyIn),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      alert("Quantity added!");
      setStatus("Quantity updated");
      setQtyIn("");
      clearForm();
      loadMasterList();
    } catch (err) {
      alert(err.message);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className={styles.page}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>SPARES — ITEM IN</div>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => navigate("/user/spares")}
            >
              CLOSE
            </button>
          </div>

          <div className={styles.card}>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.formGrid2}>
                <label className={styles.label}>
                  ITEM PART NO
                  <select
                    className={styles.control}
                    value={selectedPart}
                    onChange={(e) => handleSelectPart(e.target.value)}
                    required
                  >
                    <option value="">-- select --</option>
                    {items.map((i) => (
                      <option key={i.part_no} value={i.part_no}>
                        {i.part_no}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  ITEM NAME
                  <input
                    className={styles.control}
                    value={itemName}
                    readOnly
                  />
                </label>

                <label className={styles.label}>
                  CURRENT QTY
                  <input className={styles.control} value={currentQty} readOnly />
                </label>

                <label className={styles.label}>
                  QUANTITY IN
                  <input
                    className={styles.control}
                    type="number"
                    value={qtyIn}
                    onChange={(e) => setQtyIn(e.target.value)}
                    required
                    min="1"
                  />
                </label>
              </div>

              {status && <div>{status}</div>}

              <div className={styles.pageActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  ADD QUANTITY
                </button>
              </div>
            </form>
          </div>
    </div>
  );
}

function SparesOutPage() {
  const [items, setItems] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [itemName, setItemName] = useState("");
  const [qtyAvailable, setQtyAvailable] = useState(0);
  const [qtyOut, setQtyOut] = useState("");
  const [handingTo, setHandingTo] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  // Load part numbers
  useEffect(() => {
    loadMasterList();
  }, []);

  const loadMasterList = async () => {
    try {
      const res = await fetch(`${apiBase()}/spares/master`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };
  
  const clearForm = () => {
    setItemName('');
    setHandingTo('');
    setQtyAvailable('');
    setQtyOut('');
    setSelectedPart('');
    setStatus('');
  };

  // Auto-fill name + qty
  const handleSelectPart = async (partNo) => {
    setSelectedPart(partNo);
    const item = items.find((i) => i.part_no === partNo);

    if (item) {
      setItemName(item.item_name);
      setQtyAvailable(item.qty || 0);
    }
  };

  // Submit OUT entry
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const confirmSubmit = window.confirm(
      `Issue quantity?\n\nPart No: ${selectedPart}\nQty Out: ${qtyOut}`
    );
    if (!confirmSubmit) return;

    try {
      const res = await fetch(`${apiBase()}/spares/out`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          part_no: selectedPart,
          qty_out: Number(qtyOut),
          handing_over_to: handingTo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      alert("Item issued successfully!");

      setQtyOut("");
      setHandingTo("");
      setStatus("Item issued successfully");
      clearForm();
      loadMasterList(); // refresh qty
    } catch (err) {
      alert(err.message);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className={styles.page}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>SPARES — ITEM OUT</div>

            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => navigate("/user/spares")}
            >
              CLOSE
            </button>
          </div>

          <div className={styles.card}>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.formGrid2}>

                {/* Part No */}
                <label className={styles.label}>
                  ITEM PART NO
                  <select
                    className={styles.control}
                    value={selectedPart}
                    onChange={(e) => handleSelectPart(e.target.value)}
                    required
                  >
                    <option value="">-- select --</option>
                    {items.map((i) => (
                      <option key={i.part_no} value={i.part_no}>
                        {i.part_no}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Item Name */}
                <label className={styles.label}>
                  ITEM NAME
                  <input className={styles.control} value={itemName} readOnly />
                </label>

                {/* Qty Available */}
                <label className={styles.label}>
                  QTY AVAILABLE
                  <input
                    className={styles.control}
                    value={qtyAvailable}
                    readOnly
                  />
                </label>

                {/* Qty Out */}
                <label className={styles.label}>
                  QUANTITY OUT
                  <input
                    className={styles.control}
                    type="number"
                    value={qtyOut}
                    onChange={(e) => setQtyOut(e.target.value)}
                    required
                    min="1"
                  />
                </label>

                {/* Handing Over To */}
                <label className={styles.label}>
                  HANDING OVER TO
                  <input
                    className={styles.control}
                    type="text"
                    value={handingTo}
                    onChange={(e) => setHandingTo(e.target.value)}
                    required
                  />
                </label>
              </div>

              {status && <div>{status}</div>}

              <div className={styles.pageActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  ISSUE ITEM
                </button>
              </div>
            </form>
          </div>
    </div>
  );
}


function ViewItemPage() {
  const [items, setItems] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [itemName, setItemName] = useState("");
  const [qtyAvailable, setQtyAvailable] = useState(0);
  const [auditList, setAuditList] = useState([]);
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");

  const navigate = useNavigate();

  // Load master list
  useEffect(() => {
    loadMasterList();
  }, []);

  const loadMasterList = async () => {
    try {
      const res = await fetch(`${apiBase()}/spares/master`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };
  
  const filterAudit = async () => {
    const res = await fetch(
      `${apiBase()}/spares/audit/filter?part_no=${selectedPart}&start_date=${startDate}&end_date=${endDate}`,
      { headers: authHeaders() }
    );

    const data = await res.json();
    setAuditList(data.audit || []);
  };

  useEffect(() => {
    filterAudit(); // load all items on first render
  }, []);

  // Load item + audit when part selected
  const handleSelectPart = async (partNo) => {
    setSelectedPart(partNo);

    if (!partNo) return;

    try {
      // Item details
      const detailRes = await fetch(
        `${apiBase()}/spares/master?part_no=${partNo}`,
        { headers: authHeaders() }
      );
      const detail = await detailRes.json();

      setItemName(detail.item_name || "");
      setQtyAvailable(detail.qty || 0);

      // Audit list
      const auditRes = await fetch(
        `${apiBase()}/spares/audit?part_no=${partNo}`,
        { headers: authHeaders() }
      );
      const audit = await auditRes.json();
      setAuditList(audit.audit || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
          {/* Page Title */}
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>VIEW ITEM</div>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => navigate("/user/spares")}
            >
              CLOSE
            </button>
          </div>

          <div className={styles.card}>
            {/* FORM SECTION */}
            <div className={styles.form}>
              <div className={styles.formGrid2}>
                <label className={styles.label}>
                  ITEM PART NO
                  <select
                    className={styles.control}
                    value={selectedPart}
                    onChange={(e) => handleSelectPart(e.target.value)}
                    required
                  >
                    <option value="">-- select --</option>
                    {items.map((i) => (
                      <option key={i.part_no} value={i.part_no}>
                        {i.part_no}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  ITEM NAME
                  <input
                    className={styles.control}
                    value={itemName}
                    readOnly
                  />
                </label>

                <label className={styles.label}>
                  CURRENT QTY
                  <input
                    className={styles.control}
                    value={qtyAvailable}
                    readOnly
                  />
                </label>
              </div>
            </div>
          </div>

           {/* Date Range Filter Section */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label className={styles.label}>From:</label>
              <input
                className={styles.control}
                type="date"
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div>
              <label className={styles.label}>To:</label>
                <input
                  className={styles.control}
                  type="date"
                  onChange={(e) => setEnd(e.target.value)}
                />
            </div>

              <button className= {`${styles.btn} ${styles.btnPrimary}`} onClick={filterAudit}>Filter</button>
          </div>

          {/* AUDIT TABLE */}
            <div className={styles.card} style={{ marginTop: "20px" }}>
              <div className={styles.pageTitle}>HISTORY</div>
              <div class="table-scroll">
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Date</th>
                      <th>In</th>
                      <th>Out</th>
                      <th>User</th>
                      <th>Qty As On Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {auditList.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                          No records found
                        </td>
                      </tr>
                    ) : (
                      auditList.map((row, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{row.date}</td>
                          <td>{row.in || "-"}</td>
                          <td>{row.out || "-"}</td>
                          <td>{row.user?.username}</td>
                          <td>{row.qty_after}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
    </div>
  );
}

function StockCheckPage() {
  const [items, setItems] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  // Fetch items
  const loadStock = async () => {
    try {
      const res = await fetch(`${apiBase()}/spares/master`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // VIEW button clicked
  const handleView = () => {
    loadStock();
    setShowTable(true);
  };

  // DOWNLOAD button clicked
  const handleDownload = () => {
    window.open(`${apiBase()}/spares/stock`, "_blank");
  };

  return (
    <div className={styles.page}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.pageTitle}>STOCK CHECK</div>
            <button className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => navigate("/user/spares")}
            >
              CLOSE
            </button>
          </div>

          {/* Buttons */}
          <div className={styles.card}>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleView}>
                VIEW
              </button>

              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleDownload}>
                DOWNLOAD
              </button>
            </div>
          </div>

          {/* TABLE */}
          {showTable && (
            <div className={styles.card} style={{ marginTop: "20px" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Item Name</th>
                    <th>Part No</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>No items</td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.item_name}</td>
                        <td>{item.part_no}</td>
                        <td>{item.qty}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
}

export { SparesMasterListPage, SparesInPage, SparesOutPage, ViewItemPage, StockCheckPage };

