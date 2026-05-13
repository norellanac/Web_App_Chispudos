import { Avatar, Box, Grid2, Rating } from '@mui/material';
import {
  ButtonAtom,
  InputAtom,
  TextAtom,
} from '../../../../../components/atoms';
import { Form, Formik } from 'formik';
import { ModalComponent } from '../../../../../components/molecules';
import { useState } from 'react';
import { useAddProductReviewMutation } from '../../../../../services/reviewsApi';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { selectAuth } from '../../../../../redux/slices/authSlice';
import { getApiImageUrl } from '../../../../../utils/baseEnvironment';

type ReviewFormProps = {
  showReviewModal: boolean;
  setShowReviewModal: (value: boolean) => void;
  service?: { id: number };
};

const tagsList = ['Friendly', 'Supportive', 'Super', 'Fast'];
// i18next-parser-start
// t('features.businessReviewsPage.tags.friendly', 'Friendly')
// t('features.businessReviewsPage.tags.supportive', 'Supportive')
// t('features.businessReviewsPage.tags.super', 'Super')
// t('features.businessReviewsPage.tags.fast', 'Fast')
// i18next-parser-end

const ReviewForm = ({
  showReviewModal = false,
  setShowReviewModal = () => {},
  service,
}: ReviewFormProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const { t } = useTranslation();
  const { user } = useAppSelector(selectAuth);
  const [addProductReview] = useAddProductReviewMutation();

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmitReview = async (feedback: string) => {
    try {
      await addProductReview({
        productServiceId: service?.id,
        userId: user.id,
        rating,
        comment: selectedTags.length > 0 ? feedback + ` Tags: [${selectedTags.join(', ')}]` : feedback,
      }).unwrap();
    } catch (e) {}
  };

  return (
    <ModalComponent
      open={showReviewModal}
      onClose={() => setShowReviewModal(false)}
      title={t('features.businessOrdersPage.actions.rate', 'Leave a review')}
      hideCancelbutton
    >
      <Grid2
        container
        spacing={2}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
          <Avatar
            src={getApiImageUrl(service?.urlImage)}
            sx={{
              width: 85,
              height: 85,
              borderRadius: 50,
            }}
          />
          <TextAtom variant="headline" size="small">
            {service?.name}
          </TextAtom>
          <TextAtom variant="body" size="small">
            {t(
              'features.businessReviewsPage.reviewLabel',
              'Tap a start to rate this service',
            )}
          </TextAtom>
          <Rating
            name="half-rating"
            precision={0.5}
            onChange={(event, newValue) => {
              setRating(newValue || 0);
            }}
          />
          <TextAtom variant="body" size="small">
            {t(
              'features.businessReviewsPage.reviewSubtitle',
              'Leave your feedback here',
            )}
          </TextAtom>
          <Formik
            initialValues={{ review: '' }}
            onSubmit={(values) => {
              handleSubmitReview(values.review);
              setShowReviewModal(false);
            }}
          >
            {() => (
              <Form>
                {tagsList.map((tag, index) => (
                  <ButtonAtom
                    key={index}
                    variant={selectedTags.includes(tag) ? 'filled' : 'elevated'}
                    title={t(
                      `features.businessReviewsPage.tags.${tag.toLowerCase()}`,
                      tag,
                    )}
                    onClick={() => handleTagClick(tag)}
                    sx={{
                      margin: {xs: 1, sm: 1, md:2}
                    }}
                  >
                    {t(
                      `features.businessReviewsPage.tags.${tag.toLowerCase()}`,
                      tag,
                    )}
                  </ButtonAtom>
                ))}
                <InputAtom
                  name="review"
                  label={t(
                    'features.businessReviewsPage.writeReview',
                    'Write a review',
                  )}
                  placeholder={t(
                    'features.businessReviewsPage.writeReviewPlaceholder',
                    'Write your review here...',
                  )}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
                <ButtonAtom
                  type="submit"
                  variant="filled"
                  title={t('features.businessReviewsPage.submit', 'Submit')}
                  fullWidth
                  disabled={!rating}
                  sx={{ marginTop: '16px' }}
                >
                  {t('features.businessReviewsPage.submit', 'Submit')}
                </ButtonAtom>
              </Form>
            )}
          </Formik>
      </Grid2>
    </ModalComponent>
  );
};

export default ReviewForm;
