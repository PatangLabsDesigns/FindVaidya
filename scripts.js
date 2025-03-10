/**
 * FindVaidya Doctor Registration Form
 * Handles form validation, multiselect functionality, and form submission
 */

// Medical specialties list (alphabetically sorted)

const webHook = 'https://hook.eu2.make.com/59g8i0q2cdvgkokkh3dmxnjhtsz8b7ca';

const medicalSpecialties = [
    "Ayurvedic Medicine",
    "Allergy and Immunology",
    "Anesthesiology",
    "Cardiology",
    "Cosmetic Surgery",
    "Dentistry",
    "Dermatology",
    "Ear Throat & Throat (ENT)",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Medicine",
    "General Practice",
    "General Surgery",
    "Geriatric Medicine",
    "Gynecology",
    "Hematology",
    "Homeopathy Medicine",
    "Infectious Disease",
    "Internal Medicine",
    "IVF",
    "Naturopathy",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "Obstetrics",
    "Oncology",
    "Ophthalmology",
    "Orthopedic Medicine",
    "Orthopedic Surgery",
    "Otolaryngology",
    "Pathology",
    "Pediatrics",
    "Physical Medicine and Rehabilitation",
    "Plastic Surgery",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Sports Medicine",
    "Thoracic Surgery",
    "Urology",
    "Vascular Surgery",
    "Other"
  ].sort();
  
  /**
   * Initialize the form when the DOM is loaded
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Set max year for registration year to current year
    const currentYear = new Date().getFullYear();
    const regYearInput = document.getElementById('registrationYear');
    
    if (regYearInput) {
      regYearInput.setAttribute('max', currentYear);
    }
  
    // Initialize specialization multiselect
    initializeSpecializationDropdown();
    
    // Add form submission handler
    const form = document.getElementById('doctorRegistrationForm');
    if (form) {
      form.addEventListener('submit', submitForm);
    }
    
    // Ensure the terms checkbox is validated
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
          termsCheckbox.setCustomValidity('');
        } else {
          termsCheckbox.setCustomValidity('You must accept the Terms and Conditions');
        }
      });
    }
  });
  
  /**
   * Initialize and configure the specialization dropdown
   */
  function initializeSpecializationDropdown() {
    const searchInput = document.getElementById('specializationSearch');
    const dropdown = document.getElementById('specializationDropdown');
    const selectedContainer = document.getElementById('selectedSpecializations');
    const hiddenInput = document.getElementById('specialization');
    
    // Exit if any required elements are missing
    if (!searchInput || !dropdown || !selectedContainer || !hiddenInput) {
      console.error('Required elements for specialization dropdown not found');
      return;
    }
  
    let selectedSpecializations = [];
  
    /**
     * Updates the dropdown with filtered specialties
     * @param {string} filter - Text to filter specialties by
     */
    function updateDropdown(filter = '') {
      dropdown.innerHTML = '';
      
      const filteredSpecialties = medicalSpecialties.filter(specialty => 
        specialty.toLowerCase().includes(filter.toLowerCase()) && 
        !selectedSpecializations.includes(specialty)
      );
      
      if (filteredSpecialties.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'multiselect-item';
        noResults.textContent = 'No specialties found';
        dropdown.appendChild(noResults);
      } else {
        filteredSpecialties.forEach(specialty => {
          const item = document.createElement('div');
          item.className = 'multiselect-item';
          item.textContent = specialty;
          item.setAttribute('role', 'option');
          item.addEventListener('click', () => {
            addSpecialization(specialty);
            searchInput.value = '';
            dropdown.classList.remove('show');
            updateDropdown();
          });
          dropdown.appendChild(item);
        });
      }
    }
  
    /**
     * Adds a specialty to the selected list
     * @param {string} specialty - Specialty to add
     */
    function addSpecialization(specialty) {
      if (!selectedSpecializations.includes(specialty)) {
        selectedSpecializations.push(specialty);
        updateSelectedDisplay();
        updateHiddenInput();
      }
    }
  
    /**
     * Removes a specialty from the selected list
     * @param {string} specialty - Specialty to remove
     */
    function removeSpecialization(specialty) {
      selectedSpecializations = selectedSpecializations.filter(s => s !== specialty);
      updateSelectedDisplay();
      updateHiddenInput();
    }
  
    /**
     * Updates the display of selected specializations
     */
    function updateSelectedDisplay() {
      selectedContainer.innerHTML = '';
      
      selectedSpecializations.forEach(specialty => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        
        const text = document.createElement('span');
        text.textContent = specialty;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-item';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', `Remove ${specialty}`);
        removeBtn.addEventListener('click', () => removeSpecialization(specialty));
        
        item.appendChild(text);
        item.appendChild(removeBtn);
        selectedContainer.appendChild(item);
      });
    }
  
    /**
     * Updates the hidden input with selected values
     */
    function updateHiddenInput() {
      hiddenInput.value = selectedSpecializations.join(',');
      
      // Trigger validation
      if (selectedSpecializations.length > 0) {
        hiddenInput.setCustomValidity('');
      } else {
        hiddenInput.setCustomValidity('Please select at least one specialization');
      }
    }
  
    // Event listeners
    searchInput.addEventListener('focus', () => {
      dropdown.classList.add('show');
      updateDropdown(searchInput.value);
    });
    
    searchInput.addEventListener('input', () => {
      updateDropdown(searchInput.value);
      dropdown.classList.add('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    // Initialize dropdown
    updateDropdown();
  }
  
  /**
   * Validates and submits the form
   * @param {Event} event - Form submission event
   */
  function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('doctorRegistrationForm');
    
    // Disable the button to prevent multiple submissions
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    if (!validateForm()) {
        submitButton.disabled = false; // Re-enable on validation failure
        return;
    }

    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = key === 'phone' ? `+91${value}` : value;
    });

    formObject.timestamp = new Date().toISOString();
    formObject.submissionId = getUniqueSubmissionId();

    sendDataSecurely(formObject, submitButton, 'Submit', form);
}

  
  /**
   * Validates all form fields
   * @returns {boolean} - Whether the form is valid
   */
  function validateForm() {
    // Validate first name (required)
  const firstName = document.getElementById('firstName');
  if (!firstName.value.trim()) {
    firstName.setCustomValidity('Please enter your first name');
    firstName.reportValidity();
    return false;
  } else {
    firstName.setCustomValidity('');
  }
  
  // Validate last name (required)
  const lastName = document.getElementById('lastName');
  if (!lastName.value.trim()) {
    lastName.setCustomValidity('Please enter your last name');
    lastName.reportValidity();
    return false;
  } else {
    lastName.setCustomValidity('');
  }
  
  // Validate clinic name (required)
  const clinicName = document.getElementById('clinicName');
  if (!clinicName.value.trim()) {
    clinicName.setCustomValidity('Please enter your clinic/hospital name');
    clinicName.reportValidity();
    return false;
  } else {
    clinicName.setCustomValidity('');
  }
  
  // Validate city (required)
  const city = document.getElementById('city');
  if (!city.value.trim()) {
    city.setCustomValidity('Please enter your city');
    city.reportValidity();
    return false;
  } else {
    city.setCustomValidity('');
  }
  
  // Validate pincode (required and should be 6 digits)
  const pincode = document.getElementById('pincode');
  if (!pincode.value.trim() || pincode.value.length !== 6 || !/^\d+$/.test(pincode.value)) {
    pincode.setCustomValidity('Please enter a valid 6-digit pincode');
    pincode.reportValidity();
    return false;
  } else {
    pincode.setCustomValidity('');
  }
    // Validate email
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      email.setCustomValidity('Please enter a valid email address');
      email.reportValidity();
      return false;
    } else {
      email.setCustomValidity('');
    }
    
    // Validate phone (should be 10 digits)
    const phone = document.getElementById('phone');
    if (phone.value.length !== 10 || !/^\d+$/.test(phone.value)) {
      phone.setCustomValidity('Please enter a valid 10-digit phone number');
      phone.reportValidity();
      return false;
    } else {
      phone.setCustomValidity('');
    }
    
    // Validate specialization (at least one selected)
    const specialization = document.getElementById('specialization');
    if (!specialization.value) {
      specialization.setCustomValidity('Please select at least one specialization');
      document.getElementById('specializationSearch').focus();
      return false;
    } else {
      specialization.setCustomValidity('');
    }
    
    // Validate registration number
    const regNumber = document.getElementById('registrationNumber');
    if (!regNumber.value.trim()) {
      regNumber.setCustomValidity('Please enter your medical registration number');
      regNumber.reportValidity();
      return false;
    } else {
      regNumber.setCustomValidity('');
    }
    
    // Validate registration year
    const regYear = document.getElementById('registrationYear');
    const currentYear = new Date().getFullYear();
    const yearValue = parseInt(regYear.value);
    if (isNaN(yearValue) || yearValue < 1950 || yearValue > currentYear) {
      regYear.setCustomValidity(`Please enter a valid year between 1950 and ${currentYear}`);
      regYear.reportValidity();
      return false;
    } else {
      regYear.setCustomValidity('');
    }
    
    // Validate terms acceptance
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (!termsCheckbox.checked) {
      termsCheckbox.setCustomValidity('You must accept the Terms and Conditions');
      termsCheckbox.reportValidity();
      return false;
    } else {
      termsCheckbox.setCustomValidity('');
    }
    
    return true;
  }
  function getUniqueSubmissionId() {
    // Get or initialize a counter from localStorage
    let counter = parseInt(localStorage.getItem('submissionCounter') || '1000');
    counter++;
    localStorage.setItem('submissionCounter', counter.toString());
    
    // Create a unique ID combining timestamp and counter
    return `FV-${counter}`;
  }
  
  /**
   * Sends data securely to the webhook
   * @param {Object} data - Form data to send
   * @param {HTMLElement} submitButton - Submit button element
   * @param {string} originalText - Original button text
   * @param {HTMLElement} form - Form element
   */
  function sendDataSecurely(data, submitButton, originalText, form) {
    // Create a secure hash to verify the request (this would be better with a server-side implementation)
    const secureToken = btoa(`${data.email}:${data.timestamp}`);
    
    // Add the token to the request headers
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Security-Token': secureToken
      },
      body: JSON.stringify(data)
    };
    
    // Send data to Make.com webhook
    // Note: In production, it's better to proxy this request through your own server
    // to keep the webhook URL private and add additional security measures
    fetch(webHook,requestOptions)
    .then(response => {
        // Check if response is OK without trying to parse JSON
        if (response.ok) {
            return { success: true };
        }
        return { success: false };
    })
    .then(data => {
        if (data.success) {
            // Show success message
            form.innerHTML = `
                <article class="success-message">
                  <h2>Registration Successful!</h2>
                  <p>Thank you for registering with FindVaidya. We'll review your information and get back to you soon.</p>
                  <a href="index.html" class="SecondaryButton">Back to Home</a>
               </article>
            `;
        } else {
            // Show error
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            alert('There was an error submitting your registration. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        alert('There was an error submitting your registration. Please try again.');
    });
  }
  