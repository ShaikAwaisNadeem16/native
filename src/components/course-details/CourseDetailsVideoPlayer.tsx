import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/theme';

/**
 * CourseDetailsVideoPlayer Component
 * Video player component with play button overlay
 */
const CourseDetailsVideoPlayer: React.FC = () => {
    // Placeholder video thumbnail - replace with actual video source
    const videoThumbnail = 'https://via.placeholder.com/360x313/00213d/ffffff?text=Video+Thumbnail';

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: videoThumbnail }}
                style={styles.videoThumbnail}
                resizeMode="cover"
            />
            <View style={styles.overlay} />
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                <View style={styles.playIconContainer}>
                    <View style={styles.playIcon} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 313,
        backgroundColor: colors.primaryDarkBlue,
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(25, 26, 27, 0.6)',
    },
    playButton: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconContainer: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        width: 0,
        height: 0,
        borderLeftWidth: 24,
        borderTopWidth: 16,
        borderBottomWidth: 16,
        borderLeftColor: colors.white,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: 4,
    },
});

export default CourseDetailsVideoPlayer;






