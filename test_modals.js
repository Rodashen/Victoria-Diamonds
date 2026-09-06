// Test script to verify modal functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Testing modal functionality...');

  // Test transparency modal
  const transparencyTrigger = document.getElementById('mobileTransparencyLink');
  if (transparencyTrigger) {
    console.log('Transparency trigger found:', transparencyTrigger);
    transparencyTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Transparency trigger clicked');
      const transparencyModal = document.getElementById('transparencyModal');
      if (transparencyModal) {
        console.log('Transparency modal found:', transparencyModal);
        transparencyModal.classList.add('active');
        transparencyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('Transparency modal opened');
      } else {
        console.error('Transparency modal NOT found');
      }
    });
  } else {
    console.error('Transparency trigger NOT found');
  }

  // Test guarantee modal on mobile
  const guaranteeTriggerMobile = document.getElementById('mobileGuaranteeLink');
  if (guaranteeTriggerMobile) {
    console.log('Guarantee mobile trigger found:', guaranteeTriggerMobile);
    guaranteeTriggerMobile.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Guarantee mobile trigger clicked');
      const guaranteeModal = document.getElementById('guaranteeModal');
      if (guaranteeModal) {
        console.log('Guarantee modal found:', guaranteeModal);
        guaranteeModal.classList.add('active');
        guaranteeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('Guarantee modal opened');
      } else {
        console.error('Guarantee modal NOT found');
      }
    });
  } else {
    console.error('Guarantee mobile trigger NOT found');
  }

  // Test guarantee button in header
  const guaranteeTriggerHeader = document.querySelector('.header-guarantee-btn');
  if (guaranteeTriggerHeader) {
    console.log('Guarantee header trigger found:', guaranteeTriggerHeader);
    guaranteeTriggerHeader.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Guarantee header trigger clicked');
      const guaranteeModal = document.getElementById('guaranteeModal');
      if (guaranteeModal) {
        console.log('Guarantee modal found:', guaranteeModal);
        guaranteeModal.classList.add('active');
        guaranteeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('Guarantee modal opened');
      } else {
        console.error('Guarantee modal NOT found');
      }
    });
  } else {
    console.error('Guarantee header trigger NOT found');
  }

  // Test transparency link in nav
  const transparencyTriggerNav = document.querySelector('.js-transparency-trigger');
  if (transparencyTriggerNav) {
    console.log('Transparency nav trigger found:', transparencyTriggerNav);
    transparencyTriggerNav.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Transparency nav trigger clicked');
      const transparencyModal = document.getElementById('transparencyModal');
      if (transparencyModal) {
        console.log('Transparency modal found:', transparencyModal);
        transparencyModal.classList.add('active');
        transparencyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('Transparency modal opened');
      } else {
        console.error('Transparency modal NOT found');
      }
    });
  } else {
    console.error('Transparency nav trigger NOT found');
  }

  // Test close buttons
  const closeButtons = document.querySelectorAll('.modal-close-x, .modal-close-btn');
  console.log('Found close buttons:', closeButtons.length);
  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      console.log('Close button clicked');
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        console.log('Closing modal:', modal.id);
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Test Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      console.log('Escape key pressed');
      const transparencyModal = document.getElementById('transparencyModal');
      const guaranteeModal = document.getElementById('guaranteeModal');
      if (transparencyModal && transparencyModal.classList.contains('active')) {
        console.log('Closing transparency modal with ESC');
        transparencyModal.classList.remove('active');
        transparencyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (guaranteeModal && guaranteeModal.classList.contains('active')) {
        console.log('Closing guarantee modal with ESC');
        guaranteeModal.classList.remove('active');
        guaranteeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

  console.log('Modal test listeners added');
});