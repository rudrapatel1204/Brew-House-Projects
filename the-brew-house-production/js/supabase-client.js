/**
 * THE BREW HOUSE — SUPABASE & LOCAL DATABASE SERVICE
 * Crafted for WebBlaze Studio | Alkapuri, Vadodara, Gujarat
 * 
 * Features:
 * - Supabase Cloud Synchronization (via @supabase/supabase-js)
 * - Automatic Zero-Config Local Persistent Database Fallback
 * - Live Management Portal Data Store (Reservations, Newsletter, Orders)
 * - 1-Click CSV Data Export
 */

(function (window) {
  const STORAGE_KEYS = {
    RESERVATIONS: 'tbh_db_reservations',
    NEWSLETTER: 'tbh_db_newsletter',
    ORDERS: 'tbh_db_orders',
    SUPABASE_URL: 'tbh_supabase_url',
    SUPABASE_KEY: 'tbh_supabase_key'
  };

  // Pre-loaded seed data so the dashboard is immediately informative
  const DEFAULT_RESERVATIONS = [
    {
      id: 'tbh_res_seed_1',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      guest_name: 'Aarav Patel',
      phone: '+91 98250 12345',
      reservation_date: new Date().toISOString().split('T')[0],
      time_session: 'Golden Hour Chill (04:30 PM – 07:00 PM)',
      party_size: 2,
      spatial_zone: 'The Sunlit Greenhouse Corner',
      special_notes: 'Corner table near monsteras please',
      status: 'Confirmed'
    },
    {
      id: 'tbh_res_seed_2',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      guest_name: 'Pooja & Friends',
      phone: '+91 98980 67890',
      reservation_date: new Date().toISOString().split('T')[0],
      time_session: 'Late Night Vinyl & Acoustic (07:30 PM – 11:00 PM)',
      party_size: 4,
      spatial_zone: 'The Acoustic Lounge (Vinyl Nook)',
      special_notes: 'Acoustic jam session seats',
      status: 'Confirmed'
    }
  ];

  const DEFAULT_NEWSLETTER = [
    {
      id: 'tbh_nl_seed_1',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      email: 'wkbe@gmail.com',
      source: 'Website Footer'
    },
    {
      id: 'tbh_nl_seed_2',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      email: 'coffee.lover.vadodara@gmail.com',
      source: 'Website Footer'
    }
  ];

  class BrewHouseDatabase {
    constructor() {
      this.supabase = null;
      this.initSupabaseClient();
      this.initSeedData();
    }

    initSupabaseClient() {
      const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || (window.CONFIG && window.CONFIG.SUPABASE_URL);
      const key = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY);

      if (url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY') {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          try {
            this.supabase = window.supabase.createClient(url, key);
            console.log('⚡ Connected to Supabase Cloud Database successfully!');
          } catch (e) {
            console.warn('Supabase initialization failed:', e);
          }
        }
      }
    }

    initSeedData() {
      if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(DEFAULT_RESERVATIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NEWSLETTER)) {
        localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(DEFAULT_NEWSLETTER));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      }
    }

    // -------------------------------------------------------------
    // RESERVATIONS
    // -------------------------------------------------------------
    async addReservation(record) {
      const newEntry = {
        id: 'tbh_res_' + Date.now(),
        created_at: new Date().toISOString(),
        guest_name: record.name,
        phone: record.phone,
        reservation_date: record.date,
        time_session: record.time,
        party_size: parseInt(record.guests, 10) || 2,
        spatial_zone: record.zone,
        special_notes: record.notes || '',
        status: 'Confirmed'
      };

      // 1. Save to Local Persistent Database
      const local = this.getReservations();
      local.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(local));

      // 2. If Supabase is connected, write to Cloud
      if (this.supabase) {
        try {
          const { data, error } = await this.supabase
            .from('reservations')
            .insert([{
              guest_name: newEntry.guest_name,
              phone: newEntry.phone,
              reservation_date: newEntry.reservation_date,
              time_session: newEntry.time_session,
              party_size: newEntry.party_size,
              spatial_zone: newEntry.spatial_zone,
              special_notes: newEntry.special_notes,
              status: newEntry.status
            }]);
          if (error) console.error('Supabase reservation error:', error);
          else console.log('✓ Reservation synced to Supabase Cloud:', data);
        } catch (err) {
          console.warn('Supabase cloud insert exception:', err);
        }
      }

      return newEntry;
    }

    getReservations() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) || [];
      } catch (e) {
        return [];
      }
    }

    deleteReservation(id) {
      const filtered = this.getReservations().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(filtered));
      return filtered;
    }

    // -------------------------------------------------------------
    // NEWSLETTER SUBSCRIBERS (THE SECRET BREW LIST)
    // -------------------------------------------------------------
    async addNewsletter(email) {
      const cleanEmail = email.trim().toLowerCase();
      const local = this.getNewsletter();

      // Check if already subscribed
      const exists = local.some(item => item.email === cleanEmail);
      if (exists) {
        return { success: true, message: 'You are already on the Secret Brew List!', alreadyExists: true };
      }

      const newEntry = {
        id: 'tbh_nl_' + Date.now(),
        created_at: new Date().toISOString(),
        email: cleanEmail,
        source: 'Website Footer'
      };

      // Save locally
      local.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(local));

      // Sync to Supabase Cloud if connected
      if (this.supabase) {
        try {
          const { data, error } = await this.supabase
            .from('newsletter_subscribers')
            .insert([{ email: newEntry.email, source: newEntry.source }]);
          if (error) console.error('Supabase newsletter error:', error);
          else console.log('✓ Newsletter subscriber synced to Supabase Cloud:', data);
        } catch (err) {
          console.warn('Supabase cloud insert exception:', err);
        }
      }

      return { success: true, entry: newEntry };
    }

    getNewsletter() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER)) || [];
      } catch (e) {
        return [];
      }
    }

    deleteNewsletter(id) {
      const filtered = this.getNewsletter().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(filtered));
      return filtered;
    }

    // -------------------------------------------------------------
    // ORDERS
    // -------------------------------------------------------------
    async addOrder(orderData) {
      const newEntry = {
        id: 'tbh_ord_' + Date.now(),
        created_at: new Date().toISOString(),
        order_code: orderData.orderCode,
        items: orderData.items,
        total_amount: orderData.total,
        customer_phone: orderData.phone || 'Table Order',
        status: 'Received'
      };

      const local = this.getOrders();
      local.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(local));

      if (this.supabase) {
        try {
          await this.supabase.from('orders').insert([newEntry]);
        } catch (e) {
          console.warn('Supabase cloud order insert error:', e);
        }
      }

      return newEntry;
    }

    getOrders() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
      } catch (e) {
        return [];
      }
    }

    // -------------------------------------------------------------
    // SUPABASE CREDENTIALS MANAGEMENT
    // -------------------------------------------------------------
    setSupabaseConfig(url, key) {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
      localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
      this.initSupabaseClient();
    }

    getSupabaseConfig() {
      return {
        url: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '',
        key: localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '',
        isConnected: !!this.supabase
      };
    }

    clearSupabaseConfig() {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
      this.supabase = null;
    }
  }

  // Attach globally
  window.BrewDB = new BrewHouseDatabase();
})(window);
