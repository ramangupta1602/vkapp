/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif

#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTEventEmitter.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"VikingHealth"
                                            initialProperties:nil];

  [RNSentry installWithRootView:rootView];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  [self setCategory];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

-(void) setCategory {
  
  UNNotificationAction *acceptAction = [UNNotificationAction actionWithIdentifier:@"ACCEPT_IDENTIFIER" title:@"Accept" options:UNNotificationActionOptionAuthenticationRequired];
  
    UNNotificationAction *declineAction = [UNNotificationAction actionWithIdentifier:@"DECLINE_IDENTIFIER" title:@"Decline" options:(UNNotificationActionOptionDestructive)];
  
    UNNotificationAction *maybeAction = [UNNotificationAction actionWithIdentifier:@"MAYBE_IDENTIFIER" title:@"May Be" options:UNNotificationActionOptionNone];
    
  
 UNNotificationCategory* generalCategory = [UNNotificationCategory
       categoryWithIdentifier:@"GENERAL"
       actions:@[acceptAction, declineAction, maybeAction]
       intentIdentifiers:@[]
       options:UNNotificationCategoryOptionCustomDismissAction];
  
 // Create the custom actions for expired timer notifications.
 UNNotificationAction* snoozeAction = [UNNotificationAction
       actionWithIdentifier:@"SNOOZE_ACTION"
       title:@"Snooze"
       options:UNNotificationActionOptionNone];
  
 UNNotificationAction* stopAction = [UNNotificationAction
       actionWithIdentifier:@"STOP_ACTION"
       title:@"Stop"
       options:UNNotificationActionOptionForeground];
  
 // Create the category with the custom actions.
 UNNotificationCategory* expiredCategory = [UNNotificationCategory
       categoryWithIdentifier:@"TIMER_EXPIRED"
       actions:@[snoozeAction, stopAction]
       intentIdentifiers:@[]
       options:UNNotificationCategoryOptionNone];
  
 // Register the notification categories.
 UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
 [center setNotificationCategories:[NSSet setWithObjects:generalCategory, expiredCategory,
       nil]];
}

// Required to register for notifications
 - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
 {
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
 }
 // Required for the register event.
 - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
 {
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
 }

- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo];
}

// // Required for the notification event. You must call the completion handler after handling the remote notification.
 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
                                                        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
 {
   [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
 }



 // Required for the registrationError event.
 - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
 {
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
 }
 // Required for the localNotification event.
 - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
 {
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
 } 



@end
