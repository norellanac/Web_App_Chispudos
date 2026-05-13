import React from 'react';
import './NewsletterSubscription.css';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectBranding } from '../../redux/slices/brandingSlice';

const FALLBACK_MAILCHIMP_URL =
  'https://recolatam.us21.list-manage.com/subscribe/post?u=9611a8d33e8181fc04dad4933&id=deb6a872e3&f_id=0026ffe9f0';

const NewsletterSubscription: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSelector(selectBranding);

  if (config && !config.features.newsletterEnabled) return null;

  const formAction = config?.mailchimpApiUrl || FALLBACK_MAILCHIMP_URL;

  return (
    <Box
      sx={{
        backgroundColor: '#F3ECFF',
        paddingX: 10,
        paddingY: 10,
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        textAlign: 'center',
        display: { xs: 'none', md: 'flex' },
      }}
    >
      <div id="mc_embed_signup">
        <form
          action={formAction}
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <h2>{t('newsletter.title', 'Subscribe to our Newsletter')}</h2>
            <div className="indicates-required"></div>
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL"></label>
              <input
                type="email"
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                placeholder={t('newsletter.emailPlaceholder', 'Enter your email *')}
                required
              />
            </div>
            <div id="mce-responses" className="clear foot">
              <div className="response" id="mce-error-response" style={{ display: 'none' }} />
              <div className="response" id="mce-success-response" style={{ display: 'none' }} />
            </div>
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input type="text" name="b_placeholder" tabIndex={-1} value="" readOnly />
            </div>
            <div className="optionalParent">
              <div className="clear foot">
                <input
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="button"
                  value={t('newsletter.subscribeButton', 'Subscribe')}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Box>
  );
};

export default NewsletterSubscription;
