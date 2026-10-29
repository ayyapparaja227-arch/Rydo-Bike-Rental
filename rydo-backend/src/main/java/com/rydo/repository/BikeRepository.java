package com.rydo.repository;

import com.rydo.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByOwnerId(Long ownerId);
    List<Bike> findByStatus(String status);
    List<Bike> findByBikeType(String bikeType);
    List<Bike> findByActiveTrue();
    
    @Query("SELECT b FROM Bike b WHERE b.status = 'APPROVED' AND b.active = true " +
           "AND (:location IS NULL OR b.location LIKE %:location%) " +
           "AND (:bikeType IS NULL OR b.bikeType = :bikeType) " +
           "AND (:minPrice IS NULL OR b.hourlyPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR b.hourlyPrice <= :maxPrice)")
    List<Bike> searchBikes(
        @Param("location") String location,
        @Param("bikeType") String bikeType,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice
    );
    
    @Query("SELECT b FROM Bike b WHERE b.status = 'APPROVED' AND b.active = true " +
           "ORDER BY b.averageRating DESC, b.totalRides DESC")
    List<Bike> findFeaturedBikes();
    
    List<Bike> findByBrandAndModel(String brand, String model);
}
