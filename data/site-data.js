const siteData = {
  firmName: "Negi Tax Consultant",
  principal: {
    name: "N.S. Negi",
    role: "Proprietor & Chartered Accountant",
    qualification: "B.Com, FCA (Fellow Chartered Accountant)",
    membershipNo: "XXXXXX", // Placeholder
    frn: "XXXXXXX", // Placeholder
    experience: "18+",
    experienceDetail: "18+ years in practice",
    bio: [
      "CA N.S. Negi is a Fellow Chartered Accountant registered with the Institute of Chartered Accountants of India (ICAI), practising in Haldwani, Uttarakhand. His work covers accounting, taxation, and compliance advisory for individuals, traders, and small businesses across the Nainital district.",
      "The practice focuses on income tax return filing, GST registration and compliance, accounts bookkeeping, and business and firm registration services. CA Negi personally oversees all client engagements, ensuring accuracy and regulatory compliance at every stage.",
      "Based in Haldwani, the practice serves clients across the Kumaon region — including Nainital, Haldwani, Rudrapur, and surrounding areas — providing accessible and reliable financial guidance grounded in familiarity with the local business environment."
    ],
    avatarInitials: "NSN"
  },
  contact: {
    phone: "+91 96908 22761",
    phoneTel: "tel:+919690822761",
    whatsapp: "+91 96908 22761",
    whatsappLink: "https://wa.me/919690822761",
    email: "nsnegi.hld@gmail.com",
    emailMailto: "mailto:nsnegi.hld@gmail.com",
    address: "Near Block Office, Haldwani, Nainital, Uttarakhand",
    addressMapQuery: "29.2330320,79.4969530",
    officeHours: "Mon – Sat, 10:00 AM – 6:00 PM"
  },
  services: [
    {
      id: "accounts-book-keeping",
      number: "01",
      title: "Accounts Book Keeping",
      tag: "Accounting",
      category: "Other",
      desc: "Ongoing recording and organization of financial transactions. We provide structured bookkeeping services available on a yearly or monthly schedule, ensuring your accounts are accurate and complete.",
      audience: "Small businesses and local traders needing regular bookkeeping support."
    },
    {
      id: "gst-registration",
      number: "02",
      title: "GST Registration",
      tag: "Registration",
      category: "GST",
      desc: "Complete support for obtaining a new GST registration and managing amendments to existing registrations. We guide you through documentation to ensure hassle-free regulatory compliance.",
      audience: "New businesses starting operations, or existing businesses formalizing their GST compliance."
    },
    {
      id: "gst-return-filing",
      number: "03",
      title: "GST Return Filing",
      tag: "Compliance",
      category: "GST",
      desc: "End-to-end preparation, verification, and filing of monthly and quarterly GST returns. We help monitor transaction details to ensure files are submitted accurately and on time.",
      audience: "GST-registered businesses requiring regular, ongoing compliance support."
    },
    {
      id: "firm-company-registration",
      number: "04",
      title: "Firm / Company Registration",
      tag: "Registration",
      category: "Other",
      desc: "Structured registration and incorporation services for new business entities. We handle the process details for partnership agreements, LLPs, and private limited companies.",
      audience: "Entrepreneurs and founders looking to legally register a new business entity."
    },
    {
      id: "income-tax-return-filing",
      number: "05",
      title: "Income Tax Return Filing",
      tag: "Taxation",
      category: "ITR",
      desc: "Accurate preparation and filing of annual income tax returns. We review deductions, income details, and capital gains to ensure fully compliant filings aligned with the latest rules.",
      audience: "Individuals, salaried professionals, partners, and businesses filing their yearly taxes."
    },
    {
      id: "msme-udyam-registration",
      number: "06",
      title: "MSME / Udyam Registration",
      tag: "Registration",
      category: "Other",
      desc: "Official registration support under the Udyam portal. This registration enables small and medium enterprises to become eligible for government schemes, subsidies, and credit benefits.",
      audience: "Small, micro, and medium enterprise owners seeking official MSME registration benefits."
    },
    {
      id: "e-tds-filing-bank-loan-assistance",
      number: "07",
      title: "E-TDS Filing & Bank Loan Assistance",
      tag: "Compliance",
      category: "Other",
      desc: "Quarterly submission of E-TDS returns for compliant tax deduction tracking. We also provide documentation assistance and project report support for bank loan applications.",
      audience: "Employers with TDS obligations, and businesses/individuals applying for credit lines."
    },
    {
      id: "tax-statutory-audit",
      number: "08",
      title: "Tax & Statutory Audit",
      tag: "Audit",
      category: "Audit",
      desc: "Comprehensive auditing services to ensure statutory compliance, accurate tax assessment under the Income Tax Act, and detailed internal financial reviews.",
      audience: "Partnership firms, companies, and business owners requiring regulatory audit reports."
    }
  ],
  team: [
    {
      name: "Ankit Negi",
      role: "Associate",
      phone: "+91 84778 65564",
      tel: "tel:+918477865564",
      avatarInitials: "AN",
      focus: "GST Registration, Return Filing & Compliance",
      experience: "5+ years in tax compliance",
      bio: "Ankit specializes in GST compliance and registrations. He assists clients in navigating the GST portal, filing monthly and quarterly returns, and resolving registration queries for local businesses."
    },
    {
      name: "Manoj Tiwari",
      role: "Associate",
      phone: "+91 95680 21752",
      tel: "tel:+919568021752",
      avatarInitials: "MT",
      focus: "Accounts, Bookkeeping & E-TDS Filing",
      experience: "6+ years in accounting services",
      bio: "Manoj manages accounting and bookkeeping for local traders and small businesses. He is experienced in preparing financial statements, handling payroll accounts, and managing e-TDS return filing."
    }
  ],
  checklists: {
    itr: {
      title: "Income Tax (ITR)",
      docs: [
        "PAN Card & Aadhaar Card",
        "Form 16 (from employer, if salaried)",
        "Bank Account Statements (for the financial year)",
        "Investment proofs (80C, 80D, etc. to claim deductions)"
      ]
    },
    gst: {
      title: "GST Registration",
      docs: [
        "PAN Card of the Business / Proprietor",
        "Aadhaar Card of the Proprietor",
        "Proof of Business Address (Rent Agreement / Electricity Bill)",
        "Bank details (Cancelled Cheque / Passbook)"
      ]
    },
    company: {
      title: "Company Registration",
      docs: [
        "PAN Card & Aadhaar of all Directors",
        "Proposed Company Names (1-2 choices)",
        "Proof of Registered Office Address",
        "Digital Signature Certificate (DSC) request details"
      ]
    }
  }
};

// Backwards compatibility wrappers
const servicesList = siteData.services.map(s => s.title);
const teamMembers = siteData.team;
