/* Main App Styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Table Styles */
.table-responsive {
  margin-top: 20px;
}

.table th {
  background-color: #f8f9fa;
}

/* Form Styles */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Button Styles */
.btn-action {
  margin-right: 5px;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* Alert Styles */
.alert-container {
  margin-top: 20px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .form-container {
    padding: 15px;
  }
}

/* Card Styles */
.card {
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

/* Badge Styles */
.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
}

/* Navigation Styles */
.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

/* Utility Classes */
.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.text-center {
  text-align: center;
}