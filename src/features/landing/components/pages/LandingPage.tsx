import React from 'react';
import { LandingLayout } from '../templates/LandingLayout';
import FeatureGuarantee from '../../components/organisms/FeatureGuarantee';
import FeatureTestimonials from '../../components/organisms/FeatureTestimonials';
import FeatureDownloadApp from '../../components/organisms/FeatureDownloadApp';
import Footer from '../../../../components/organisms/Footer';
import ListCategories from '../../../home/components/organisms/ListCategories';
import GroupedServices from '../../../home/components/organisms/GroupedServices';
import CategoriesSection from '../organisms/CategoriesSection';
import SearchForm from '../../../../components/organisms/SearchForm';
import NewsletterSubscription from '../../../../components/organisms/NewsletterSubscription';
import HeroSection from '../organisms/HeroSection';
import { useGetProductsQuery } from '../../../../services/productApi';
import { Category } from '../../../../types/api/modelTypes';
import { useProductServiceFilterData } from '../../../../hooks/useProductServiceFilterData';
import { useBranding } from '../../../../hooks/useBranding';

export const LandingPage: React.FC = () => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const { config } = useBranding();
  const newsletterEnabled = !config || config.features.newsletterEnabled;

  const {
    filteredServices,
    filters,
    updateSearchTerm,
    updatePriceRange,
    updateCategories,
    updateMinRating,
    resetFilters,
    availableCategories,
    priceRange,
    filteredCount,
    totalCount,
  } = useProductServiceFilterData();

  const [categoryItem, setCategoryItem] = React.useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    updateCategories([category.id]);
    setCategoryItem(category);
  };

  return (
    <LandingLayout>
      <HeroSection />
      <SearchForm />
      <ListCategories handleCategoryClick={handleCategoryClick} />
      <GroupedServices
        services={filteredServices}
        titleText={categoryItem?.name}
      />
      {/* <CategoriesSection /> */}
      <FeatureTestimonials />
      {/* <FeatureGuarantee /> */}
      <FeatureDownloadApp />
      {newsletterEnabled && <NewsletterSubscription />}
      <Footer />
    </LandingLayout>
  );
};
