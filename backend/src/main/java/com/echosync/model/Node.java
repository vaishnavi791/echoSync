package com.echosync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("stadium_node")
public class Node {
    @Id
    private String id;
    private String name;
    private String type; // e.g., "GATE", "CONCOURSE", "SEATING_SECTION"
    
    // Coordinates for AR/Map
    private double x;
    private double y;
}
