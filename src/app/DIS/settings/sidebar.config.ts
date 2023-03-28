import { RoleTypes } from '@dis/services/auth/roles.enum';
// Will allow show/hide of links in sidebar when sign-on flow is implemented

export const config = [
  // Add navigation group here
  {
    // group: 'Navigation Group 1',
    // Add navigation items here
    items: [
      // {
      //   name: 'Dashboard',
      //   icon: 'crosstab',
      //   link: './dashboard',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER] // Specify user roles allowed to see this link: NOT YET IMPLEMENTED
      // },
      // {
      //   name: 'Dashboard Sample 2',
      //   icon: 'crosstab',
      //   link: './dashboard-sample-2',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER] // Specify user roles allowed to see this link: NOT YET IMPLEMENTED
      // },
      // {
      //   name: 'Sample',
      //   icon: 'crosstab',
      //   link: './sample',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER] // Specify user roles allowed to see this link: NOT YET IMPLEMENTED
      // },
      // {
      //   name: 'Sample 2',
      //   icon: 'crosstab',
      //   link: './sample2',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      // },
      // {
      //   name: 'Dashboard',
      //   icon: 'crosstab',
      //   link: './dashboard-analysis',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      // },
     //
      {
        name: 'Dashboard',
        icon: 'crosstab',
        link: './dashboard-analysis-kendo',
        elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      },
      {
        name: 'Analysis',
        icon: 'align-left-element',
        link: './historical-analysis',
        elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      },
      {
        name: 'Prediction',
        icon: 'crosstab',
        link: './upload',
        elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      },
      // {
      //   name: 'Prediction-New',
      //   icon: 'crosstab',
      //   link: './analysis-new',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      // },
      // {
      //   name: 'Report Downtime',
      //   icon: 'error',
      //   link: './report-downtime',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      // },
      // {
      //   name: 'Upload Excel Files V2',
      //   icon: 'folder-up',
      //   link: './fileupload',
      //   elevation: [RoleTypes.ROLE_MANAGER, RoleTypes.ROLE_USER]
      // },
    ]
  },
  // {
  //   group: 'Navigation Group 2',
  //   items: [
  //     {
  //       name: 'Login',
  //       icon: 'login',
  //       link: './login',
  //       elevation: [RoleTypes.ROLE_ADMIN]
  //     }
  //   ]
  // }
];
