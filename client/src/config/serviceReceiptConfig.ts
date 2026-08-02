export interface ServiceReceiptConfig {
  brandName: string;
  legalName: string;
  address: string;
  companyId: string;
  vatId: string;
  phone: string;
  email: string;
  termsUrl: string;
}

const serviceReceiptConfig: ServiceReceiptConfig = {
  brandName: "Neon Mobile Repair",

  /*
   * Fill these values with the details
   * of your own repair service before
   * using receipts with customers.
   */
  legalName: "Udut Viktor",
  address: "Praha, Czech Republic",
  companyId: "12323456789",
  vatId: "123456789",
  phone: "+420 123 456 789",
  email: "info@neonmobilerepair.com",
  termsUrl: "https://www.neonmobilerepair.com/terms",
};

export default serviceReceiptConfig;
