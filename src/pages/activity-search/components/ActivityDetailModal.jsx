import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityDetailModal = ({ activity, onClose, onAddToTrip, onToggleFavorite }) => {
  if (!activity) return null;

  const reviews = [
  {
    id: 1,
    author: "Sarah Johnson",
    authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f2e0f9a8-1763300113479.png",
    authorImageAlt: "Professional headshot of Caucasian woman with blonde hair in casual blue shirt smiling warmly",
    rating: 5,
    date: "December 2025",
    comment: "Absolutely amazing experience! The guide was knowledgeable and the views were breathtaking. Highly recommend for anyone visiting the area."
  },
  {
    id: 2,
    author: "Michael Chen",
    authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_17936537e-1763298650062.png",
    authorImageAlt: "Professional headshot of Asian man with short black hair in navy business suit with confident expression",
    rating: 4,
    date: "November 2025",
    comment: "Great activity overall. Worth the price and time. Only minor issue was the wait time at the entrance, but everything else was perfect."
  },
  {
    id: 3,
    author: "Emma Rodriguez",
    authorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1040de6b2-1763293731979.png",
    authorImageAlt: "Professional headshot of Hispanic woman with long dark hair in elegant black dress with warm smile",
    rating: 5,
    date: "October 2025",
    comment: "One of the best experiences of our trip! The staff was friendly and accommodating. Perfect for families and couples alike."
  }];


  const additionalImages = [
  {
    url: "https://images.unsplash.com/photo-1649686886940-c542f8ce3195",
    alt: "Panoramic view of historic landmark with blue sky and tourists walking on cobblestone plaza"
  },
  {
    url: "https://images.unsplash.com/photo-1682492585140-e319951424d8",
    alt: "Interior architectural detail showing ornate ceiling with golden decorations and natural lighting"
  },
  {
    url: "https://images.unsplash.com/photo-1672987453899-f98fc5da08f8",
    alt: "Close-up of traditional cultural artifacts displayed in museum setting with warm ambient lighting"
  }];


  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose} />

      <div className="relative bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="font-heading font-semibold text-xl text-foreground">
            Activity Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-base focus-ring"
            aria-label="Close modal">

            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
            <Image
              src={activity?.image}
              alt={activity?.imageAlt}
              className="w-full h-full object-cover" />

            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-caption font-medium">
                {activity?.category}
              </span>
              <span className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-caption font-semibold text-foreground">
                {activity?.priceRange}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground flex-1">
                {activity?.name}
              </h3>
              <div className="flex items-center space-x-1 ml-4">
                <Icon name="Star" size={20} color="var(--color-accent)" className="fill-current" />
                <span className="font-data font-bold text-lg text-foreground">
                  {activity?.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({activity?.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} color="var(--color-secondary)" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-caption font-semibold text-foreground">
                    {activity?.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={20} color="var(--color-accent)" />
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-data font-bold text-sm text-foreground">
                    ${activity?.estimatedCost}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} color="var(--color-primary)" />
                <div>
                  <p className="text-xs text-muted-foreground">Group Size</p>
                  <p className="text-sm font-caption font-semibold text-foreground">
                    Up to 15
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Languages" size={20} color="var(--color-secondary)" />
                <div>
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="text-sm font-caption font-semibold text-foreground">
                    English, Spanish
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="font-heading font-semibold text-lg text-foreground mb-2">
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activity?.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground mb-4">
              Photo Gallery
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {additionalImages?.map((img, index) =>
              <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                  src={img?.url}
                  alt={img?.alt}
                  className="w-full h-full object-cover hover-lift transition-base" />

                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground mb-4">
              What's Included
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
              'Professional guide',
              'Entrance fees',
              'Transportation',
              'Refreshments',
              'Photo opportunities',
              'Safety equipment']?.
              map((item, index) =>
              <div key={index} className="flex items-center space-x-2">
                  <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-semibold text-lg text-foreground">
                Reviews ({reviews?.length})
              </h4>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} color="var(--color-accent)" className="fill-current" />
                <span className="font-data font-semibold text-sm text-foreground">
                  {activity?.rating} / 5
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {reviews?.map((review) =>
              <div key={review?.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Image
                    src={review?.authorImage}
                    alt={review?.authorImageAlt}
                    className="w-10 h-10 rounded-full object-cover" />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-caption font-semibold text-sm text-foreground">
                          {review?.author}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {review?.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)]?.map((_, i) =>
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        color={i < review?.rating ? 'var(--color-accent)' : 'var(--color-muted-foreground)'}
                        className={i < review?.rating ? 'fill-current' : ''} />

                      )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review?.comment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              onClick={() => {
                onAddToTrip(activity);
                onClose();
              }}>

              Add to Trip
            </Button>
            <Button
              variant="outline"
              size="icon"
              iconName="Heart"
              aria-label={activity?.isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => onToggleFavorite?.(activity?.id)} />

            <Button
              variant="outline"
              size="icon"
              iconName="Share2"
              aria-label="Share activity" />

          </div>
        </div>
      </div>
    </div>);

};

export default ActivityDetailModal;