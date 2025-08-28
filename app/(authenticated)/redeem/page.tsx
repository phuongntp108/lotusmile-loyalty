"use client";

import React, { useState } from "react";
import {
  Gift,
  ShoppingBag,
  Coffee,
  Plane,
  Gamepad2,
  Star,
  Crown,
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import getRewardOffers from "@/fetchers/ssm/get-reward-offers";
import { ofetch } from "ofetch";
import {
  RedeemOfferPayload,
  RedeemOfferResponse,
  RewardStoreOffer,
} from "@/types";
import { getAccessToken } from "@/helpers/access-token";
import { queryClient } from "@/lib/queryClient";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image: string;
  discount?: string;
  value?: string;
  available: number;
  popular?: boolean;
}

const mockRewards: Reward[] = [
  {
    id: "1",
    title: "Starbucks Coffee Voucher",
    description: "Enjoy a free medium-sized coffee at any Starbucks location",
    points: 500,
    category: "food",
    image: "☕",
    value: "$5.00",
    available: 50,
    popular: true,
  },
  {
    id: "2",
    title: "20% Off Fashion Items",
    description: "Get 20% discount on all fashion items in our partner stores",
    points: 800,
    category: "shopping",
    image: "👕",
    discount: "20% OFF",
    available: 30,
  },
  {
    id: "3",
    title: "Free Movie Ticket",
    description: "Complimentary movie ticket for any show at partner cinemas",
    points: 1200,
    category: "entertainment",
    image: "🎬",
    value: "$12.00",
    available: 25,
    popular: true,
  },
  {
    id: "4",
    title: "Amazon Gift Card",
    description: "$10 Amazon gift card for online shopping",
    points: 1000,
    category: "shopping",
    image: "🛒",
    value: "$10.00",
    available: 100,
  },
  {
    id: "5",
    title: "Spotify Premium (1 Month)",
    description: "1 month of Spotify Premium subscription",
    points: 1500,
    category: "entertainment",
    image: "🎵",
    value: "$9.99",
    available: 20,
  },
  {
    id: "6",
    title: "Pizza Hut Meal Deal",
    description: "Large pizza + 2 drinks + garlic bread combo",
    points: 1800,
    category: "food",
    image: "🍕",
    value: "$18.00",
    available: 15,
  },
  {
    id: "7",
    title: "Airline Miles (5000)",
    description: "5000 airline miles for your next flight booking",
    points: 2500,
    category: "travel",
    image: "✈️",
    value: "5000 miles",
    available: 10,
  },
  {
    id: "8",
    title: "Gaming Console Discount",
    description: "$50 off on gaming console purchase",
    points: 5000,
    category: "entertainment",
    image: "🎮",
    discount: "$50 OFF",
    available: 5,
    popular: true,
  },
];

export default function RewardsPage() {
  const { user } = useAuth();
  const userPoints =
    user?.tier_details?.point_account_balances.summary.total_points ?? 0;
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    reward: RewardStoreOffer | null;
  }>({ isOpen: false, reward: null });

  const { data } = useQuery({
    queryKey: ["/reward-offers"],
    queryFn: async () => {
      const res = await ofetch<RedeemOfferResponse>("/api/reward-offers");
      return res.data;
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["/redeem-offer"],
    mutationFn: async (rewardStoreOfferId: string) => {
      const res = await ofetch("/api/redeem", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        body: { rewardStoreOfferId } as RedeemOfferPayload,
      });
      return res.data;
    },
    onError: (error) => {
      console.error("Error redeeming offer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to redeem offer. Please try again later.",
      });
    },
    onSuccess: (data) => {
      console.log("Successfully redeemed offer:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/point-history"] });
      toast({
        title: "Success",
        description: "Offer redeemed successfully!",
      });
    },
  });

  const rewardOffers = data?.payload.reward_store_offers ?? [];

  const handleRedemptionClick = (reward: RewardStoreOffer) => {
    if (userPoints >= reward.price) {
      setConfirmDialog({ isOpen: true, reward });
    } else {
      toast({
        title: "Insufficient points",
        description: `❌ Insufficient points. You need ${
          reward.price - userPoints
        } more points.`,
      });
    }
  };

  const handleConfirmRedemption = async () => {
    if (confirmDialog.reward) {
      await mutateAsync(confirmDialog.reward.id);
      toast({
        title: "Success",
        description: `🎉 Successfully redeemed ${
          confirmDialog.reward!.offer_details.title
        }!`,
      });
      setConfirmDialog({ isOpen: false, reward: null });
    }
  };

  const handleCancelRedemption = () => {
    setConfirmDialog({ isOpen: false, reward: null });
  };

  const categories = [
    { id: "all", name: "All Rewards", icon: Gift },
    { id: "food", name: "Food & Drink", icon: Coffee },
    { id: "shopping", name: "Shopping", icon: ShoppingBag },
    { id: "entertainment", name: "Entertainment", icon: Gamepad2 },
    { id: "travel", name: "Travel", icon: Plane },
  ];

  const filteredRewards =
    activeCategory === "all"
      ? mockRewards
      : mockRewards.filter((r) => r.category === activeCategory);

  const nextLevelPoints = user?.next_tier_points ?? 0;
  const pointToNextTier = nextLevelPoints ? nextLevelPoints - userPoints : 0;
  const progressPercentage = (userPoints / nextLevelPoints) * 100;
  const userLevel = user?.tier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-600 to-orange-300">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">
                Loyalty Rewards Program
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Earn. Redeem. Enjoy.
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Turn your loyalty into amazing rewards. Discover exclusive offers
              and redeem your points for incredible experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Points Balance Section */}
        <div className="relative -mt-20 mb-12">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-tr from-indigo-700 via-indigo-500 to-orange-400 p-8">
              <div className="grid md:grid-cols-3 gap-8 text-white">
                {/* Points Balance */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Star className="h-6 w-6 text-yellow-300" />
                    <span className="text-lg font-medium">
                      Available Points
                    </span>
                  </div>
                  <div className="text-4xl font-bold">
                    {userPoints?.toLocaleString()}
                  </div>
                </div>

                {/* Level Status */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-6 w-6 text-yellow-300" />
                    <span className="text-lg font-medium">Current Level</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span className="text-xl font-bold">{userLevel}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-yellow-300" />
                    <span className="text-lg font-medium">Next Level</span>
                  </div>
                  <div className="text-lg">
                    {pointToNextTier} points to next tier
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Next Level</span>
                <span>
                  {userPoints}/{nextLevelPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewardOffers.map((reward, index) => {
            const canRedeem = userPoints >= reward.price;

            return (
              <div
                key={reward.id}
                className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  Math.random() > 0.5
                    ? "ring-2 ring-indigo-500 ring-opacity-50"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {Math.random() > 0.5 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Reward Image/Icon */}
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {mockRewards[index].image}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {reward.offer_details.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {reward.offer_details.description}
                    </p>
                  </div>

                  {/* Category Badge */}
                  {/* <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      {React.createElement(getCategoryIcon(reward.category), {
                        className: "h-3 w-3",
                      })}
                      {getCategoryName(reward.offer_details.offer_status)}
                    </div>
                  </div> */}

                  {/* Points and Value */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Points Required
                      </span>
                      <span className="font-bold text-indigo-600">
                        {reward.offer_details.points?.toLocaleString()}
                      </span>
                    </div>

                    {reward.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Value</span>
                        <span className="font-bold text-green-600">
                          {reward.price}
                        </span>
                      </div>
                    )}

                    {/* {reward.discount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Discount</span>
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {reward.discount}
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Redeem Button */}
                  <button
                    onClick={() => handleRedemptionClick(reward)}
                    disabled={!canRedeem}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 ${"bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 shadow-lg hover:shadow-xl"}`}
                  >
                    🎁 Redeem Now
                  </button>
                </div>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No rewards found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category to see more rewards.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && handleCancelRedemption()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Confirm Redemption
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.reward && (
            <div className="space-y-4">
              {/* Reward Preview */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{mockRewards[0].image}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {confirmDialog.reward.offer_details.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {confirmDialog.reward.offer_details.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points Required:</span>
                    <span className="font-bold text-indigo-600">
                      {confirmDialog.reward.price.toLocaleString()}
                    </span>
                  </div>
                  {confirmDialog.reward.offer_details.points && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-bold text-green-600">
                        {confirmDialog.reward.offer_details.points}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Points Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Points:</span>
                    <span className="font-bold">
                      {userPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points to Redeem:</span>
                    <span className="font-bold text-red-600">
                      -{confirmDialog.reward.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-700 font-medium">
                      Remaining Points:
                    </span>
                    <span className="font-bold text-indigo-600">
                      {(
                        userPoints - confirmDialog.reward.price
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelRedemption}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={handleConfirmRedemption}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white flex items-center gap-2"
            >
              <Gift className="h-4 w-4" />
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
