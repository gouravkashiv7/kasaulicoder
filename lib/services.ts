// The four capability groups KasauliCoder offers. Shared by the homepage,
// the services page, the contact form and the footer.

export interface ServiceGroup {
  id: string;
  icon: string;
  title: string;
  summary: string;
  description: string;
  includes: string[];
  needs: string[];
  note?: string;
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: "product-engineering",
    icon: "deployed_code",
    title: "Product Engineering",
    summary:
      "SaaS products, custom applications and web platforms, designed and built from the first version through to production.",
    description:
      "We design and develop software around how your business and your customers actually work: the data model, the interface, the APIs behind it and the deployment it runs on.",
    includes: [
      "SaaS product development",
      "Custom web applications and internal tools",
      "Business websites and web platforms",
      "UI/UX design and responsive interfaces",
    ],
    needs: [
      "You want to turn an idea or an internal process into software your customers or staff can use.",
      "Your team runs on spreadsheets and disconnected tools and needs one system.",
      "Your current website or application is difficult to use or to maintain.",
    ],
  },
  {
    id: "business-automation",
    icon: "account_tree",
    title: "Business Automation",
    summary:
      "Workflow automation and integrations that take repetitive, manual steps off your team.",
    description:
      "We look at where time goes on repeated tasks and re-entered data, then build the automations and integrations that connect your tools so information moves on its own.",
    includes: [
      "Automation of repetitive workflows",
      "Integrations between the tools you already use",
      "Automated notifications and email confirmations",
      "Keeping data in sync across systems",
    ],
    needs: [
      "Staff copy the same information between several systems.",
      "Bookings, orders or approvals depend on manual follow-up.",
      "Your tools do not share data with each other.",
    ],
  },
  {
    id: "seo-digital-growth",
    icon: "travel_explore",
    title: "SEO & Digital Growth",
    summary:
      "Search visibility and website optimization, so customers looking for what you offer can find you.",
    description:
      "We improve the technical and on-page parts of your website that affect how search engines read it and how fast it loads for visitors.",
    includes: [
      "Technical SEO reviews and fixes",
      "Page titles, metadata and content structure",
      "Site speed and Core Web Vitals improvements",
      "Structured data and search-friendly site architecture",
    ],
    needs: [
      "Customers struggle to find your business in search results.",
      "Your website is slow or hard to navigate.",
      "You are launching a new site and want it built search-friendly from the start.",
    ],
    note: "Search rankings depend on factors no one fully controls, so we do not promise positions. We focus on the parts of your website that can be improved.",
  },
  {
    id: "cloud-support",
    icon: "cloud_done",
    title: "Cloud & Technical Support",
    summary:
      "Infrastructure, deployment and ongoing technical support for the software your business depends on.",
    description:
      "We set up hosting and deployment for your applications and can stay on after launch to keep them updated, secure and working.",
    includes: [
      "Cloud hosting setup and deployment",
      "Server, domain and SSL configuration",
      "Maintenance, updates and bug fixes",
      "Ongoing technical support after launch",
    ],
    needs: [
      "Your application needs a dependable place to run.",
      "No one on your team looks after updates and fixes.",
      "Releasing a new version is a manual, error-prone process.",
    ],
  },
];
