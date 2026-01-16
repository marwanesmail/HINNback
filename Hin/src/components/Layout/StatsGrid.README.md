# StatsGrid Component

A reusable, consistent, and elegant statistics grid component for all dashboards in the healthcare platform.

## Purpose

This component was created to provide a unified design and behavior for statistics displays across all dashboards (Doctor, Pharmacy, Company, Patient, Admin) while maintaining flexibility for customization.

## Features

- Responsive grid layout with configurable columns (1-6)
- Smooth animations with Framer Motion
- Hover effects for interactivity
- Customizable colors, borders, and backgrounds
- Support for icons and trend indicators
- Consistent spacing and typography
- Modern card design with left border accent

## Usage

Import the component:

```jsx
import StatsGrid from "../../../components/Layout/StatsGrid";
```

Basic usage:

```jsx
<StatsGrid stats={statsData} columns={3} />
```

## Props

| Prop    | Type   | Default | Description                      |
| ------- | ------ | ------- | -------------------------------- |
| stats   | Array  | []      | Array of stat objects to display |
| columns | Number | 3       | Number of columns (1-6)          |

## Stat Object Structure

Each stat object in the stats array can have the following properties:

```js
{
  id: 1,                     // Unique identifier
  title: "عدد الأطباء",      // Display title
  value: 42,                 // Statistic value
  icon: <FaUserMd />,        // Icon component
  iconBg: "bg-blue-100",     // Icon background color
  borderLeft: "border-blue-500", // Left border accent color
  textColor: "text-gray-600", // Title text color
  valueColor: "text-gray-900", // Value text color
  trend: 12,                 // Trend value (optional)
  trendIcon: FaChartLine,    // Trend icon (optional)
  trendText: "من الشهر الماضي", // Trend text (optional)
  subtitle: "Subtitle text", // Subtitle text (optional)
  subtitleColor: "text-gray-500" // Subtitle color (optional)
}
```

## Design Changes

The component has been updated with a new design:

- Clean white background with subtle shadow
- Accent border on the left side for visual distinction
- Icons in colored circular containers
- Improved spacing and typography hierarchy
- Subtle hover effect (lift effect)

## Examples

See the component in action in:

- `src/pages/doctor/components/DashboardSection.jsx`
- `src/pages/pharmacy/components/PharmacyDashboardSection.jsx`
- `src/pages/company/components/CompanyDashboardSection.jsx`
- `src/pages/patient/components/PatientDashboardSection.jsx`
- `src/pages/admin/components/DashboardOverview.jsx`

## Benefits

1. **Consistency**: All dashboards now use the same component with a unified design language
2. **Maintainability**: Changes to the stats grid only need to be made in one place
3. **Flexibility**: Easy to customize colors, icons, and layout for different contexts
4. **Performance**: Optimized animations and rendering
5. **Accessibility**: Proper contrast ratios and semantic HTML
