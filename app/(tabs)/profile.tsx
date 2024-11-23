import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Feather, Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { useColorScheme } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    dob: string;
    appNotifications: boolean;
    emailNotifications: boolean;
}

type IconComponent = typeof Feather | typeof Ionicons | typeof Entypo | typeof AntDesign;

interface GeneralInfoItem {
    icon: string;
    Component: IconComponent;
    value: string;
    key: keyof Omit<ProfileData, 'appNotifications' | 'emailNotifications'> | 'feedback';
}

interface NotificationItem {
    icon: string;
    Component: IconComponent;
    label: string;
    value: boolean;
    key: 'appNotifications' | 'emailNotifications';
}

const Profile: React.FC = () => {
    const colorScheme = useColorScheme();
    const textColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"].text;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profileNamecheck, setProfileNamecheck] = useState<string>("");
    const [profileData, setProfileData] = useState<ProfileData>({
        name: 'Zach Nugent',
        email: 'SaikatSamanta052@gmail.com',
        phone: '+91-8884058513',
        dob: '10-10-1998',
        appNotifications: false,
        emailNotifications: false
    });

    const generalInfoItems: GeneralInfoItem[] = [
        { icon: 'user', Component: AntDesign, value: profileData.name, key: 'name' },
        { icon: 'mail-unread-outline', Component: Ionicons, value: profileData.email, key: 'email' },
        { icon: 'smartphone', Component: Feather, value: profileData.phone, key: 'phone' },
        { icon: 'calendar', Component: AntDesign, value: profileData.dob, key: 'dob' },
        { icon: 'message-square', Component: Feather, value: 'Feedback', key: 'feedback' }
    ];

    const notificationItems: NotificationItem[] = [
        {
            icon: 'message1',
            Component: AntDesign,
            label: 'App Notification',
            value: profileData.appNotifications,
            key: 'appNotifications'
        },
        {
            icon: 'notifications-outline',
            Component: Ionicons,
            label: 'Email Notification',
            value: profileData.emailNotifications,
            key: 'emailNotifications'
        }
    ];

    const handleDataChange = <K extends keyof ProfileData>(key: K, value: ProfileData[K]): void => {
        setProfileData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const renderGeneralInfoItem = (item: GeneralInfoItem, index: number): JSX.Element => (
        <React.Fragment key={item.key}>
            <View className='flex flex-row items-center my-2'>
                <item.Component name={item.icon as any} size={24} color={textColor} />
                {isEditing && item.key !== 'feedback' ? (
                    <TextInput
                        value={item.value}
                        onChangeText={(text) => handleDataChange(item.key as keyof ProfileData, text)}
                        style={{
                            marginLeft: 20,
                            fontSize: 16,
                            color: textColor,
                            flex: 1,
                            padding: 8,
                            borderBottomWidth: 1,
                            borderColor: '#ccc'
                        }}
                    />
                ) : (
                    <Text className='text-xl text-muted-foreground ms-5'>{item.value}</Text>
                )}
            </View>
            {index < generalInfoItems.length - 1 && <Separator className='my-1' />}
        </React.Fragment>
    );

    const renderNotificationItem = (item: NotificationItem, index: number): JSX.Element => (
        <React.Fragment key={item.key}>
            <View className='flex-row items-center justify-between'>
                <TouchableOpacity
                    onPress={() => handleDataChange(item.key, !item.value)}
                    className='flex-row flex-1 gap-5'
                >
                    <item.Component name={item.icon as any} size={24} color={textColor} />
                    <Text className='text-xl text-muted-foreground'>{item.label}</Text>
                </TouchableOpacity>
                <Switch
                    checked={item.value}
                    onCheckedChange={(value) => handleDataChange(item.key, value)}
                />
            </View>
            {index < notificationItems.length - 1 && <Separator className='my-2' />}
        </React.Fragment>
    );

    const handleSignOut = (): void => {
        // Implement sign out logic
    };

    const handleDeleteAccount = (): void => {
        console.log("Deleted account")
        // Implement delete account logic
    };

    return (
        
            <ScrollView className='py-10 mx-5'>
            <SafeAreaView >
                <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                    className='absolute top-0 flex-row items-center p-2 border-[1px] right-0 rounded-lg border-slate-300'
                >
                    <Feather name="edit" size={15} color={textColor} />
                    <Text className='ml-2 text-foreground'>{isEditing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>

                <Avatar className='w-40 h-40 mx-auto' alt=''>
                    <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                    <AvatarFallback>
                        <Text className='text-3xl'>ZN</Text>
                    </AvatarFallback>
                </Avatar>

                <Text className='mt-5 text-4xl font-bold text-center text-foreground'>
                    {profileData.name}
                </Text>
                <Text className='text-center text-gray-600 text-md'>
                    Joined on : 31st Jan 2024
                </Text>

                <View className='p-4 border-[1px] mt-9 rounded-2xl border-neutral-300'>
                    <Text className='mb-4 text-2xl font-normal text-foreground'>General</Text>
                    {generalInfoItems.map((item, index) => renderGeneralInfoItem(item, index))}
                </View>

                <View className='p-4 border-[1px] mt-9 rounded-2xl border-neutral-300'>
                    <Text className='mb-4 text-2xl font-normal text-foreground'>Notifications</Text>
                    {notificationItems.map((item, index) => renderNotificationItem(item, index))}
                </View>

                <TouchableOpacity
                    className='p-4 my-5 border border-red-500 rounded-lg'
                    onPress={handleSignOut}
                >
                    <Text className='font-bold text-center text-red-500'>Sign Out</Text>
                </TouchableOpacity>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <TouchableOpacity
                            className='flex-row items-center justify-center p-4 bg-red-500 rounded-lg '
                        >
                            <AntDesign name="delete" size={18} color="white" />
                            <Text className='ml-2 font-bold text-white'>Delete Account</Text>
                        </TouchableOpacity>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>Delete profile !</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Please enter your username ({profileData.name}) to confirm.
                            </DialogDescription>
                        </DialogHeader>
                        <TextInput value={profileNamecheck} onChangeText={val=>setProfileNamecheck(val)} placeholder={profileData.name} className='border-[1px] rounded-sm p-2 border-gray-400 text-foreground' />
                        <DialogFooter className='flex-row justify-end'>
                            <Button variant="outline"><Text className='text-foreground' onPress={()=>{setIsOpen(false); console.log("closing")}}>Cancel</Text></Button>
                            <Button disabled={profileData.name!==profileNamecheck} variant="destructive" onPress={()=>{setIsOpen(false)}}>
                                <Text className='text-white' >Delete!</Text>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            
        </SafeAreaView>
        </ScrollView>
    );
};

export default Profile;