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
@Table("stadium_edge")
public class Edge {
    @Id
    private String id;
    private String sourceNodeId;
    private String targetNodeId;
    
    // Base distance or time
    private double baseWeight;
}
